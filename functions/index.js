const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto"); // Built-in Node.js module for security

admin.initializeApp();
const db = admin.firestore();

// Initialize Razorpay with credentials from your functions/.env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * 1. Trigger: createRazorpayOrder
 * Creates an order ID securely on the backend before the payment sheet opens.
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  try {
    const options = {
      amount: Math.round(data.amount * 100), // Amount in paise, ensured it's an integer
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { orderId: order.id };
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * 2. Trigger: verifyPaymentAndSaveOrder
 * Verifies the Razorpay signature for security, then saves the order to Firestore.
 */
exports.verifyPaymentAndSaveOrder = functions.https.onCall(async (data, context) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = data;

    // Securely verify the signature to ensure no one spoofed the payment
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new functions.https.HttpsError("permission-denied", "Payment signature verification failed.");
    }

    // Signature is valid! Save the order to Firestore
    const orderRef = await db.collection("orders").add({
      ...orderDetails,
      razorpay_order_id,
      razorpay_payment_id,
      status: "Paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error("Verification/Save Error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * 3. Trigger: placeCODOrder
 * Saves Cash on Delivery orders directly to Firestore.
 */
exports.placeCODOrder = functions.https.onCall(async (data, context) => {
  try {
    const { orderDetails } = data;

    const orderRef = await db.collection("orders").add({
      ...orderDetails,
      status: "Pending (COD)",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error("COD Save Error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * 4. Trigger: sendOrderNotification
 * Runs automatically when a new order is saved to Firestore.
 */
exports.sendOrderNotification = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    try {
      const orderData = snap.data();
      const userToken = orderData.fcmToken;

      if (!userToken) return null;

      const payload = {
        notification: {
          title: "Order Placed Successfully! 🌿",
          body: `Thank you! Your order for ₹${orderData.total} has been received.`,
        },
        token: userToken,
      };

      await admin.messaging().send(payload);
      return { success: true };
    } catch (error) {
      console.error("Notification Error:", error);
      return { error: error.message };
    }
  });