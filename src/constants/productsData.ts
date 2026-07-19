// app/constants/productsData.ts

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     
    .replace(/[^\w-]+/g, '')  
    .replace(/--+/g, '-');    
};

export const PRODUCTS = {
  // ==========================================
  // CATEGORY 1: READY-TO-COOK MIXES
  // ==========================================
  'rtc_bbb': {
    id: 'rtc_bbb',
    name: 'Multi Millet Bisi Bele Bath Mix',
    image: null,
    category: 'Ready-to-Cook Mixes',
    description: 'An aromatic, traditional spicy lentil and multi-millet rice alternative. Wholesome comfort food made quick.',
    variants: [{ label: '500g', price: '₹145.00', originalPrice: '₹185.00' }],
    nutritionalInfo: {
      ingredients: ['Kodo Millet', 'Little Millet', 'Toor Dal', 'Native Spice Blend', 'Ghee Flavor'],
      keyNutrients: ['Rich in Plant Protein & Dietary Fiber'],
      healthBenefits: ['Low Glycemic Load compared to white rice', 'Sustains mid-day energy']
    }
  },
  'rtc_khichdi': {
    id: 'rtc_khichdi',
    name: 'Multi Millet Khichdi Mix',
    image: null,
    category: 'Ready-to-Cook Mixes',
    description: 'A light, healing, and comforting blend of ancient millets and yellow moong dal for optimal digestive wellness.',
    variants: [{ label: '500g', price: '₹130.00', originalPrice: '₹170.00' }],
    nutritionalInfo: {
      ingredients: ['Barnyard Millet', 'Foxtail Millet', 'Moong Dal', 'Jeera', 'Turmeric'],
      keyNutrients: ['High Bio-available Iron & Magnesium'],
      healthBenefits: ['Easy on the gut, excellent for detox cycles']
    }
  },
  'f4': {
    id: 'f4',
    name: 'Multi Millet Jowar Daliya',
    image: require('../../assets/Jowar-Flour.png'), 
    category: 'Ready-to-Cook Mixes',
    description: 'Gluten-free, high-protein, dietary fiber and iron. Diabetic friendly, aids in weight loss.',
    variants: [{ label: '1 Kg', price: '₹160.00', originalPrice: '₹190.00' }],
    nutritionalInfo: {
      ingredients: ['Multi Millet Jowar Daliya'],
      keyNutrients: ['Calories 350, Protein 11g, Fat 2g, Carbs 73g (Per 100g)'],
      healthBenefits: ['Gluten-free, high-protein', 'Diabetic friendly, aids in weight loss']
    }
  },
  'b1': {
    id: 'b1',
    name: 'Rice Idly Mix & Upma Mixes',
    image: require('../../assets/rice-idly-mix.png'),
    category: 'Ready-to-Cook Mixes',
    description: 'Easy to prepare, healthy, tasty, and soft. Traditional formulations quick to make.',
    variants: [
      { label: 'Rice Idly Mix 1kg', price: '₹140.00', originalPrice: '₹180.00' },
      { label: 'Premium Upma Mix 1kg', price: '₹150.00', originalPrice: '₹190.00' }
    ],
    nutritionalInfo: {
      ingredients: ['Rice Idly Mix Components', 'Premium Upma Mix Components'],
      keyNutrients: ['Idly Mix: Protein 6.8g, Carbs 76g. Upma Mix: Protein 9.2g, Carbs 72.5g (Per 100g)'],
      healthBenefits: ['Soft, spongy traditional outputs', 'Wholesome everyday meals']
    }
  },
  'premium_upma_mix': {
    id: 'premium_upma_mix',
    name: 'Premium Upma Mix',
    image: require('../../assets/upma-mix.png'),
    category: 'Ready-to-Cook Mixes',
    description: 'Wholesome. Delicious. Traditional. Made with select grains and premium ingredients.',
    variants: [{ label: '1 Kg', price: '₹150.00', originalPrice: '₹190.00' }],
    nutritionalInfo: {
      ingredients: ['Semolina (Wheat)', 'Edible Vegetable Oil', 'Roasted Bengal Gram', 'Dehydrated Vegetables (Carrot, Green Peas, Onion)', 'Split Black Gram', 'Cashew Nuts', 'Mustard', 'Curry Leaves', 'Green Chilli', 'Iodised Salt', 'Ginger', 'Acidity Regulator (INS 330)', 'Anticaking Agent (INS 551)'],
      keyNutrients: ['Energy 385 kcal, Protein 9.2g, Carbohydrates 72.5g, Sugars 1.8g, Dietary Fibre 3.8g, Total Fat 6.5g, Saturated Fat 1.1g, Trans Fat 0g, Cholesterol 0mg, Sodium 780mg, Iron 1.5mg, Calcium 18mg (Per 100g Mix)'],
      healthBenefits: ['No added preservatives', 'No added colours']
    }
  },
  'rice_idly_mix': {
    id: 'rice_idly_mix',
    name: 'Rice Idly Mix',
    image: require('../../assets/rice-idly-mix.png'),
    category: 'Ready-to-Cook Mixes',
    description: 'Soft. Spongy. Traditional idlis made easy with fine quality rice and dal.',
    variants: [{ label: '1 Kg', price: '₹140.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Rice', 'Black Gram (Urad Dal)', 'Bengal Gram (Chana Dal)', 'Fenugreek', 'Iodised Salt', 'Leavening Agent (INS 500(ii))'],
      keyNutrients: ['Energy 345 kcal, Protein 6.8g, Carbohydrates 76.0g, Sugars 0g, Dietary Fibre 2.2g, Total Fat 1.2g, Saturated Fat 0.3g, Trans Fat 0g (Per 100g Mix)'],
      healthBenefits: ['Naturally wholesome', 'No artificial colours or flavours']
    }
  },
  'instant_dosa_mix': {
    id: 'instant_dosa_mix',
    name: 'Instant Dosa Mix',
    image: require('../../assets/Dosa-mix.png'),
    category: 'Ready-to-Cook Mixes',
    description: 'Crispy. Delicious. Wholesome. A perfect blend of traditional grains and dals.',
    variants: [{ label: '1 Kg', price: '₹150.00', originalPrice: '₹190.00' }],
    nutritionalInfo: {
      ingredients: ['Rice Flour', 'Black Gram (Urad Dal) Flour', 'Bengal Gram (Chana Dal)', 'Toor Dal', 'Flattened Rice (Poha)', 'Wheat Flour', 'Jowar (Sorghum) Flour', 'Fenugreek', 'Iodised Salt', 'Leavening Agents (INS 500(ii))', 'Acidity Regulator (INS 296)', 'Yeast'],
      keyNutrients: ['Energy 340 kcal, Protein 9g, Carbohydrates 70g, Sugars 1g, Fat 1.5g, Saturated Fat 0.5g, Fibre 3g, Sodium 300mg (Per 100g Dry Mix)'],
      healthBenefits: ['Goodness of multi grains & dals', 'No added preservatives']
    }
  },
  'rtc_pongal': {
    id: 'rtc_pongal',
    name: 'Multi Millet Pongal Mix',
    image: null,
    category: 'Ready-to-Cook Mixes',
    description: 'Traditional South Indian comfort breakfast breakfast solution packed with clean nutrition and black pepper accents.',
    variants: [{ label: '500g', price: '₹135.00', originalPrice: '₹175.00' }],
    nutritionalInfo: {
      ingredients: ['Proso Millet', 'Moong Dal', 'Black Pepper', 'Ginger', 'Cashew pieces'],
      keyNutrients: ['Essential Amino Acids, Fiber Dense'],
      healthBenefits: ['Supports lightweight cardiac cardiovascular baselines']
    }
  },
  'rtc_dosa': {
    id: 'rtc_dosa',
    name: 'Multi Millet Dosa Mix',
    image: null,
    category: 'Ready-to-Cook Mixes',
    description: 'Get perfectly crisp, golden multi-millet dosas with high fiber metrics and zero preparation hassle.',
    variants: [{ label: '500g', price: '₹145.00', originalPrice: '₹190.00' }],
    nutritionalInfo: {
      ingredients: ['Finger Millet', 'Jowar', 'Bajra', 'Urad Dal Flour'],
      keyNutrients: ['Protein 13g, Fiber 9.5g (Per 100g)'],
      healthBenefits: ['Low glycemic index response layout']
    }
  },
  'rtc_adai': {
    id: 'rtc_adai',
    name: 'Multi Millet Adai Mix',
    image: null,
    category: 'Ready-to-Cook Mixes',
    description: 'A thick, traditional, fiber-heavy multi-lentil pancake mix loaded with iron-rich grains.',
    variants: [{ label: '500g', price: '₹150.00', originalPrice: '₹195.00' }],
    nutritionalInfo: {
      ingredients: ['Mixed Millets', 'Toor Dal', 'Chana Dal', 'Hing', 'Red Chillies'],
      keyNutrients: ['High Plant-Based Protein & Zinc'],
      healthBenefits: ['Sustained structural energy discharge profile']
    }
  },
  'rtc_soup': {
    id: 'rtc_soup',
    name: 'Multi Millet Soup Mix',
    image: null,
    category: 'Ready-to-Cook Mixes',
    description: 'A comforting, warm health soup powered by ancient grain minerals and bio-active plant seasonings.',
    variants: [{ label: '200g', price: '₹125.00', originalPrice: '₹165.00' }],
    nutritionalInfo: {
      ingredients: ['Finely Milled Millets', 'Dehydrated Vegetables', 'Black Salt', 'Herbs'],
      keyNutrients: ['Rich in Trace Minerals & Micronutrients'],
      healthBenefits: ['Improves metabolic baselines and shields gut wall health']
    }
  },

  // ==========================================
  // CATEGORY 2: HEALTHY BREAKFAST RANGE
  // ==========================================
  'f2': {
    id: 'f2',
    name: 'Multi Millet Flour',
    image: require('../../assets/Multi-millet-flour.png'), 
    category: 'Healthy Breakfast Range',
    description: 'Gluten free, rich in dietary fiber, controls diabetes and helps in preventing celiac disease.',
    variants: [{ label: '1 Kg', price: '₹220.00', originalPrice: '₹260.00' }],
    nutritionalInfo: {
      ingredients: ['Multi Millet Flour (100% Millets)'],
      keyNutrients: ['Calories: 332, Protein: 9g, Total Fat: 3g, Carbohydrate: 67g (Per 100g)'],
      healthBenefits: ['Rich in dietary fiber, manages glycemic responses']
    }
  },
  'hb_muesli': {
    id: 'hb_muesli',
    name: 'Multi Millet Muesli',
    image: null,
    category: 'Healthy Breakfast Range',
    description: 'Crisp rolled millets, pumpkin seeds, and clean fruit notes for a clean, structural breakfast base.',
    variants: [{ label: '400g', price: '₹299.00', originalPrice: '₹399.00' }],
    nutritionalInfo: {
      ingredients: ['Rolled Ragi', 'Rolled Jowar', 'Pumpkin Seeds', 'Almonds', 'Raisins'],
      keyNutrients: ['High Omega-3 Fatty Acids, Iron, and Complex Carbs'],
      healthBenefits: ['Promotes vascular health and long-lasting morning satiety']
    }
  },
  'hb_granola': {
    id: 'hb_granola',
    name: 'Millet Granola',
    image: null,
    category: 'Healthy Breakfast Range',
    description: 'Oven-toasted clusters of honey-glazed organic whole millets blended with premium nuts.',
    variants: [{ label: '400g', price: '₹320.00', originalPrice: '₹425.00' }],
    nutritionalInfo: {
      ingredients: ['Whole Millets', 'Almonds', 'Walnuts', 'Organic Nectar Syrup'],
      keyNutrients: ['Antioxidant-dense crunchy configuration'],
      healthBenefits: ['Provides a clean, crash-free energy release baseline']
    }
  },
  'hb_porridge_inst': {
    id: 'hb_porridge_inst',
    name: 'Millet Instant Porridge',
    image: null,
    category: 'Healthy Breakfast Range',
    description: 'Just add hot milk or water. Pre-cooked sprouted millet flour for ultra-fast morning nutrition.',
    variants: [{ label: '300g', price: '₹165.00', originalPrice: '₹210.00' }],
    nutritionalInfo: {
      ingredients: ['Pre-cooked Sprouted Ragi', 'Jowar', 'Natural Cardamom Powder'],
      keyNutrients: ['Easily Digestible Carbohydrates, High Calcium'],
      healthBenefits: ['Perfect quick meal for busy workspaces and active mornings']
    }
  },
  'hb_cereal': {
    id: 'hb_cereal',
    name: 'Millet Breakfast Cereal',
    image: null,
    category: 'Healthy Breakfast Range',
    description: 'Crisp whole-grain flakes formulated to offer clean alternative profiles over commercial sugar-loaded cereals.',
    variants: [{ label: '350g', price: '₹195.00', originalPrice: '₹260.00' }],
    nutritionalInfo: {
      ingredients: ['Jowar Flakes', 'Bajra Flakes', 'Finger Millet Flakes'],
      keyNutrients: ['100% Whole Grain, Zero Refined Sugars'],
      healthBenefits: ['Supports lightweight digestion and gastrointestinal flow']
    }
  },
  'hb_pancake': {
    id: 'hb_pancake',
    name: 'Millet Pancake Mix',
    image: null,
    category: 'Healthy Breakfast Range',
    description: 'Fluffy, delicious breakfast pancakes crafted completely without maida binders or wheat flour.',
    variants: [{ label: '400g', price: '₹180.00', originalPrice: '₹240.00' }],
    nutritionalInfo: {
      ingredients: ['Foxtail Millet Flour', 'Oat Flour', 'Natural Vanilla Bean Extract'],
      keyNutrients: ['Rich in Plant Proteins and Intestinal Fibers'],
      healthBenefits: ['Kid-friendly clean nutrition choice that limits inflammation']
    }
  },

  // ==========================================
  // CATEGORY 3: HEALTHY SNACKING RANGE
  // ==========================================
  'snk_laddu': {
    id: 'snk_laddu',
    name: 'Multi Millet Jaggery Laddu',
    image: require('../../assets/jaggery-laddu.png'), 
    category: 'Healthy Snacking Range',
    description: 'A nutritious sweet snack blending ancient grains, calcium-dense sesame, and iron-rich organic jaggery.',
    variants: [{ label: 'Pack of 4', price: '₹499.00', originalPrice: '₹699.00' }],
    nutritionalInfo: {
      ingredients: ['Millet Flour Blend', 'Peanuts', 'White Sesame', 'Organic Jaggery Powder'],
      keyNutrients: ['High Calcium (1283mg in Sesame), Plant Protein 26g'],
      healthBenefits: ['Boosts bone structural health and supplies clean dietary fats']
    }
  },
  'snk_cookies': {
    id: 'snk_cookies',
    name: 'Millet Cookies',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'Crisp, guilt-free bakery cookies prepared using real butter, whole grains, and zero palm oils.',
    variants: [{ label: '200g', price: '₹150.00', originalPrice: '₹200.00' }],
    nutritionalInfo: {
      ingredients: ['Finger Millet Flour', 'Creamery Butter', 'Organic Jaggery Base'],
      keyNutrients: ['Trans-Fat-Free, Pure Whole Grain Snacking'],
      healthBenefits: ['Safe, blood-sugar-conscious accompaniment for tea times']
    }
  },
  'snk_murukku': {
    id: 'snk_murukku',
    name: 'Millet Murukku',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'Traditional crunchy South Indian snack baked or flash-fried cleanly in cold-pressed rice bran oil.',
    variants: [{ label: '150g', price: '₹95.00', originalPrice: '₹130.00' }],
    nutritionalInfo: {
      ingredients: ['Kodo Millet Flour', 'Roasted Gram Flour', 'Spices'],
      keyNutrients: ['Low Moisture, High Crisp Texture Fiber'],
      healthBenefits: ['A healthy swap for chemically preserved commercial crisps']
    }
  },
  'snk_khakhra': {
    id: 'snk_khakhra',
    name: 'Millet Khakhra',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'Crisp, hand-pressed roasted flatbread crackers perfect for light snack hours at the office.',
    variants: [{ label: '200g', price: '₹110.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['Jowar Flour', 'Whole Wheat Bran Layers', 'Fresh Methi Leaves'],
      keyNutrients: ['Low Calorie Density, High Saturation Profile'],
      healthBenefits: ['Excellent metabolic support option for weight control']
    }
  },
  'snk_roasted': {
    id: 'snk_roasted',
    name: 'Millet Roasted Snacks',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'Non-fried, oil-popped puff millets tossed in mild native rock salt and herbal seasonings.',
    variants: [{ label: '150g', price: '₹85.00', originalPrice: '₹115.00' }],
    nutritionalInfo: {
      ingredients: ['Puffed Sorghum (Jowar)', 'Puffed Bajra', 'Turmeric', 'Rock Salt'],
      keyNutrients: ['Zero Oil, Extremely Low Calorie Footprint'],
      healthBenefits: ['Perfect light crunch for continuous weight-conscious snacking']
    }
  },
  'snk_bars': {
    id: 'snk_bars',
    name: 'Millet Energy Bars',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'Cold-pressed snack bars packed with puffed grains and natural fruit binding matrixes.',
    variants: [{ label: 'Pack of 6', price: '₹360.00', originalPrice: '₹450.00' }],
    nutritionalInfo: {
      ingredients: ['Puffed Millets', 'Dates Paste', 'Chia Seeds', 'Almond Slivers'],
      keyNutrients: ['No High-Fructose Corn Syrup (HFCS), High Omega-3'],
      healthBenefits: ['Instant muscle fuel recovery bar for pre/post-workout blocks']
    }
  },
  'snk_chikki': {
    id: 'snk_chikki',
    name: 'Millet Chikki with Jaggery',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'Classic hard brittle snack bars combining popped ragi grains and melted organic jaggery syrup.',
    variants: [{ label: '200g', price: '₹120.00', originalPrice: '₹160.00' }],
    nutritionalInfo: {
      ingredients: ['Puffed Finger Millet', 'Roasted Peanuts', 'Concentrated Jaggery'],
      keyNutrients: ['High Bio-available Iron, Clean Sucrose Minerals'],
      healthBenefits: ['Combats iron deficiencies and structural fatigue naturally']
    }
  },
  'snk_namkeen': {
    id: 'snk_namkeen',
    name: 'Millet Namkeen Mix',
    image: null,
    category: 'Healthy Snacking Range',
    description: 'A crunchy, savory mixture of roasted millets, lentils, and nuts seasoned with classic chat spices.',
    variants: [{ label: '200g', price: '₹130.00', originalPrice: '₹175.00' }],
    nutritionalInfo: {
      ingredients: ['Flaked Bajra', 'Roasted Chana', 'Cashews', 'Curry Powder Spice'],
      keyNutrients: ['Low Sodium, High Protein savory asset'],
      healthBenefits: ['Satisfies salty cravings safely without spiking blood pressure']
    }
  },

  // ==========================================
  // CATEGORY 4: BAKERY & CONVENIENCE FOODS
  // ==========================================
  'millet_moringa_noodles': {
    id: 'millet_moringa_noodles',
    name: 'Millet Moringa Noodles',
    image: require('../../assets/Moringa-noodles.png'),
    category: 'Bakery & Convenience Foods',
    description: 'A wholesome blend of millets and moringa for a nutritious and delicious meal.',
    variants: [{ label: '100g', price: '₹95.00', originalPrice: '₹125.00' }],
    nutritionalInfo: {
      ingredients: ['Moringa Powder', 'Sorghum', 'Foxtail Millet', 'Finger Millet', 'Emmer Wheat', 'Wheat', 'Salt', 'Edible Oil'],
      keyNutrients: ['Energy 380 kcal, Protein 11g, Carbohydrates 72g, Sugars 3g, Total Fat 6g, Saturated Fat 2g, Dietary Fibre 8g, Sodium 450mg, Iron 4mg, Calcium 80mg (Per 100g)'],
      healthBenefits: ['Rich in nutrients', 'Goodness of 5 super millets', 'No added preservatives']
    }
  },
  'emmer_wheat_noodles': {
    id: 'emmer_wheat_noodles',
    name: 'Emmer Wheat Super Grains Noodles',
    image: require('../../assets/emmer-wheat-noodles.png'),
    category: 'Bakery & Convenience Foods',
    description: 'A wholesome blend of ancient emmer wheat, wheat and jowar (sorghum) crafted for a nutritious meal.',
    variants: [{ label: '100g', price: '₹95.00', originalPrice: '₹125.00' }],
    nutritionalInfo: {
      ingredients: ['Emmer Wheat Flour', 'Wheat Flour (Atta)', 'Jowar (Sorghum) Flour', 'Edible Vegetable Oil', 'Salt'],
      keyNutrients: ['Energy 380 kcal, Protein 13g, Carbohydrates 73g, Sugars 2g, Total Fat 6g, Saturated Fat 2g, Dietary Fibre 7g, Sodium 450mg, Iron 4.5mg, Calcium 70mg (Per 100g Dry Noodles)'],
      healthBenefits: ['Good source of protein', 'Source of dietary fibre', 'No added preservatives']
    }
  },
  'emmer_wheat_pasta': {
    id: 'emmer_wheat_pasta',
    name: 'Emmer Wheat Super Grains Pasta',
    image: require('../../assets/emmer-wheat-pasta.png'),
    category: 'Bakery & Convenience Foods',
    description: 'A wholesome blend of ancient emmer wheat, wheat and jowar (sorghum) crafted for a nutritious meal.',
    variants: [{ label: '200g', price: '₹150.00', originalPrice: '₹195.00' }],
    nutritionalInfo: {
      ingredients: ['Emmer Wheat Flour', 'Wheat Flour (Atta)', 'Jowar (Sorghum) Flour', 'Edible Vegetable Oil', 'Salt'],
      keyNutrients: ['Energy 360 kcal, Protein 12g, Carbohydrates 72g, Sugars 3g, Total Fat 3g, Saturated Fat 0.5g, Dietary Fibre 6g, Sodium 200mg, Iron 4mg, Calcium 70mg (Per 100g Dry Pasta)'],
      healthBenefits: ['Source of dietary fibre', 'Good source of protein', 'No added preservatives']
    }
  },
  'millet_moringa_pasta': {
    id: 'millet_moringa_pasta',
    name: 'Millet Moringa Pasta',
    image: require('../../assets/millet-moringa-pasta.png'),
    category: 'Bakery & Convenience Foods',
    description: 'A wholesome blend of millets and moringa for a nutritious and delicious meal.',
    variants: [{ label: '200g', price: '₹160.00', originalPrice: '₹210.00' }],
    nutritionalInfo: {
      ingredients: ['Moringa Powder', 'Sorghum', 'Foxtail Millet', 'Finger Millet', 'Emmer Wheat', 'Wheat', 'Salt', 'Edible Oil'],
      keyNutrients: ['Energy 370 kcal, Protein 12g, Carbohydrates 72g, Sugars 3g, Total Fat 4g, Saturated Fat 1.5g, Dietary Fibre 8g, Sodium 350mg, Iron 4mg, Calcium 50-90mg (Per 100g Dry Pasta)'],
      healthBenefits: ['Rich in nutrients', 'Goodness of Moringa', 'Made with 5 super millets']
    }
  },
  'cv_macaroni': {
    id: 'cv_macaroni',
    name: 'Multi Millet Macaroni',
    image: null,
    category: 'Bakery & Convenience Foods',
    description: 'Wholesome elbows made entirely from clean flour mixtures. Ideal for nutrient-packed healthy lunches.',
    variants: [{ label: '400g', price: '₹280.00', originalPrice: '₹390.00' }],
    nutritionalInfo: {
      ingredients: ['Finger Millet Flour', 'Sorghum Flour', 'Semolina Cores'],
      keyNutrients: ['High Intestinal Soluble Fibers'],
      healthBenefits: ['Excellent alternative options for kids\' nutritional management']
    }
  },
  'cv_rusk': {
    id: 'cv_rusk',
    name: 'Millet Rusk',
    image: null,
    category: 'Bakery & Convenience Foods',
    description: 'Twice-baked crispy tea-time dipping rusks made using whole grains and zero hydrogenated vegetable fats.',
    variants: [{ label: '200g', price: '₹120.00', originalPrice: '₹160.00' }],
    nutritionalInfo: {
      ingredients: ['Emmer Wheat Flour', 'Finger Millet Malts', 'Cardamom Extracted Oils'],
      keyNutrients: ['High Dietary Roughage Content'],
      healthBenefits: ['Gentle on the stomach during morning digestive cycles']
    }
  },
  'cv_bread_mix': {
    id: 'cv_bread_mix',
    name: 'Millet Bread Mix',
    image: null,
    category: 'Bakery & Convenience Foods',
    description: 'Bake your own artisanal whole-grain artisan bread at home. Simple instructions, clean recipe layout.',
    variants: [{ label: '500g', price: '₹210.00', originalPrice: '₹280.00' }],
    nutritionalInfo: {
      ingredients: ['Jowar Flour', 'Oat Flour', 'Dry Active Yeast Pack', 'Flax Powder Binders'],
      keyNutrients: ['Low Carbohydrate Loading Factor, High Protein'],
      healthBenefits: ['Enables clean home baking entirely free of chemical bread softeners']
    }
  },
  'cv_pizza_base': {
    id: 'cv_pizza_base',
    name: 'Millet Pizza Base Mix',
    image: null,
    category: 'Bakery & Convenience Foods',
    description: 'Bake customized, inflammation-free thin pizza crust bases using premium flour matrices.',
    variants: [{ label: 'Pack of 2 Bases', price: '₹160.00', originalPrice: '₹220.00' }],
    nutritionalInfo: {
      ingredients: ['Sorghum Flour', 'Tapioca Root Starch Stiffeners', 'Baking Powder'],
      keyNutrients: ['Low Glycemic Load Index Structural Config'],
      healthBenefits: ['Allows comfort food indulgence without triggering insulin spikes']
    }
  },
  'cv_vermicelli': {
    id: 'cv_vermicelli',
    name: 'Millet Vermicelli',
    image: null,
    category: 'Bakery & Convenience Foods',
    description: 'Fine vermicelli threads made from ancient millet grains, ideal for healthy upmas or desserts.',
    variants: [{ label: '400g', price: '₹115.00', originalPrice: '₹155.00' }],
    nutritionalInfo: {
      ingredients: ['Ragi Grain Extracted Starches', 'Little Millet Flour Base'],
      keyNutrients: ['Rich in Soluble Bran Carbohydrates'],
      healthBenefits: ['Lightweight meal profile that doesn\'t place loads on target intestines']
    }
  },
  'cv_rte_meals': {
    id: 'cv_rte_meals',
    name: 'Millet Ready-to-Eat Meals',
    image: null,
    category: 'Bakery & Convenience Foods',
    description: 'Retort-packaged, shelf-stable nutritious meals. Heat and eat in under 60 seconds.',
    variants: [{ label: '300g (Pouch)', price: '₹175.00', originalPrice: '₹240.00' }],
    nutritionalInfo: {
      ingredients: ['Cooked Foxtail Millet Khichdi', 'Organic Vegetables', 'Cold Pressed Oils'],
      keyNutrients: ['Preservative-Free sterilization tech layout'],
      healthBenefits: ['Healthy fast food options for busy professionals on the move']
    }
  },

  // ==========================================
  // CATEGORY 5: HEALTH & WELLNESS RANGE
  // ==========================================
  'wn_sugar_atta': {
    id: 'wn_sugar_atta',
    name: 'Sugar Management Atta',
    image: require('../../assets/black-wheat.png'), 
    category: 'Health & Wellness Range',
    description: 'Specialized 100% stone-ground anthocyanin-rich black wheat flour clinically optimized for slow carbohydrate discharge.',
    variants: [
      { label: 'Sugar Management Atta 1 Kg', price: '₹299.00', originalPrice: '₹399.00' },
      { label: 'Sugar Management Atta 5 Kg', price: '₹1489.00', originalPrice: '₹1950.00' }
    ],
    nutritionalInfo: {
      ingredients: ['100% Bio-Active Black Wheat grains'],
      keyNutrients: ['Anthocyanin Antioxidants, Dietary Fiber (12g per 100g)'],
      healthBenefits: ['Helps keep blood glucose metrics level, preventing insulin spikes']
    }
  },
  'wn_diabetic_mix': {
    id: 'wn_diabetic_mix',
    name: 'Diabetic-Friendly Millet Mix (Diabetic Care Bliss)',
    image: require('../../assets/diabetic-care.png'), 
    category: 'Health & Wellness Range',
    description: 'Expertly designed blend of sprouted grains and medicinal herbs to support insulin baseline responses.',
    variants: [{ label: '1 Kg', price: '₹599.00', originalPrice: '₹699.00' }],
    nutritionalInfo: {
      ingredients: ['Sprouted Grains', 'Moringa Leaf Extract', 'Methi Seed Concentrates', 'Nuts'],
      keyNutrients: ['High Slow-Digesting Starch (SDS), Bioactive Phenols'],
      healthBenefits: ['Directly blunts postprandial blood sugar spikes']
    }
  },
  'wn_weight_mix': {
    id: 'wn_weight_mix',
    name: 'Weight Management Millet Mix',
    image: null,
    category: 'Health & Wellness Range',
    description: 'High-bulk, calorie-friendly meal substitute designed to prolong fullness and boost metabolic fat oxidation.',
    variants: [{ label: '1 Kg', price: '₹450.00', originalPrice: '₹550.00' }],
    nutritionalInfo: {
      ingredients: ['Barnyard Millet Cores', 'Kodo Millet', 'Flaxseed Mucilage Bran'],
      keyNutrients: ['Dense Insoluble Roughage, Plant Lignans'],
      healthBenefits: ['Naturally suppresses appetite and curbs mid-day snack cravings']
    }
  },
  'wn_protein_mix': {
    id: 'wn_protein_mix',
    name: 'High-Protein Millet Nutrition Mix',
    image: null,
    category: 'Health & Wellness Range',
    description: 'A high-powered functional drink powder combining ancient grains and vegan protein isolates.',
    variants: [{ label: '500g', price: '₹495.00', originalPrice: '₹650.00' }],
    nutritionalInfo: {
      ingredients: ['Sprouted Amaranth Flour', 'Sorghum Flours', 'Pea Protein Isolate Core'],
      keyNutrients: ['24g Complete Plant Protein per 100g serving'],
      healthBenefits: ['Accelerates muscle rebuilding and satisfies daily metabolic intake demands']
    }
  },
  'wn_baby_food': {
    id: 'wn_baby_food',
    name: 'Millet Baby Food',
    image: null,
    category: 'Health & Wellness Range',
    description: 'A sprout-activated infant porridge mix completely free of white sugars, salts, or synthetic compounds.',
    variants: [{ label: '400g', price: '₹275.00', originalPrice: '₹350.00' }],
    nutritionalInfo: {
      ingredients: ['Sprouted Finger Millet Malts', 'Makhana Flours', 'Almond powder meal'],
      keyNutrients: ['Highly bio-available Calcium and natural Iron links'],
      healthBenefits: ['Promotes pristine skeletal growth tracking frames']
    }
  },
  'wn_women_mix': {
    id: 'wn_women_mix',
    name: 'Millet Women’s Health Mix',
    image: null,
    category: 'Health & Wellness Range',
    description: 'A hormone-balancing nutritional blend fortified with high iron, calcium, and adaptogenic herbs.',
    variants: [{ label: '500g', price: '₹380.00', originalPrice: '₹480.00' }],
    nutritionalInfo: {
      ingredients: ['Sprouted Ragi', 'Black Sesame', 'Shatavari Extract', 'Folic Acid trace seeds'],
      keyNutrients: ['Iron-dense structural config, phytoestrogens'],
      healthBenefits: ['Combats iron deficiencies and supports natural hormone cycles']
    }
  },
  'wn_senior_mix': {
    id: 'wn_senior_mix',
    name: 'Millet Senior Citizen Nutrition Mix',
    image: null,
    category: 'Health & Wellness Range',
    description: 'An easily digestible, joint-supporting nutrition drink mix adjusted for low-impact digestive profiles.',
    variants: [{ label: '500g', price: '₹395.00', originalPrice: '₹495.00' }],
    nutritionalInfo: {
      ingredients: ['Pre-gelatinized Millets', 'Ashwagandha', 'Plant Glucosamine elements'],
      keyNutrients: ['Low Glycemic Load, High Absorption Bone Minerals'],
      healthBenefits: ['Supports bone density maintenance and eases nutrient absorption in older adults']
    }
  },

  // ==========================================
  // CATEGORY 6: TRADITIONAL VALUE-ADDED PRODUCTS
  // ==========================================
  'trad_ganji': {
    id: 'trad_ganji',
    name: 'Millet Ganji (Health Porridge Mix)',
    image: null,
    category: 'Traditional Value-Added Products',
    description: 'A traditional household health drink powder designed to cool the body and restore natural energy.',
    variants: [{ label: '500g', price: '₹160.00', originalPrice: '₹220.00' }],
    nutritionalInfo: {
      ingredients: ['Finger Millet Kernels', 'Buttermilk dry crystals', 'Roasted Cumin'],
      keyNutrients: ['Enzyme-ready trace element mapping'],
      healthBenefits: ['Hydrates and naturally balances body heat during hot seasons']
    }
  },
  'trad_ragi_malt': {
    id: 'trad_ragi_malt',
    name: 'Ragi Malt',
    image: null,
    category: 'Traditional Value-Added Products',
    description: '100% sprouted finger millet malt powder. A rich, creamy traditional wellness beverage.',
    variants: [{ label: '500g', price: '₹140.00', originalPrice: '₹195.00' }],
    nutritionalInfo: {
      ingredients: ['Sprouted Ragi Grain grains'],
      keyNutrients: ['High structural plant Calcium, Vitamin D activation support'],
      healthBenefits: ['Excellent daily energy drink that supports bone density profile layers']
    }
  },
  'trad_payasam': {
    id: 'trad_payasam',
    name: 'Millet Payasam Mix',
    image: null,
    category: 'Traditional Value-Added Products',
    description: 'A clean, health-conscious take on the classic Indian festive dessert, powered by fine foxtail grains.',
    variants: [{ label: '400g', price: '₹180.00', originalPrice: '₹240.00' }],
    nutritionalInfo: {
      ingredients: ['Foxtail Millet Flakes', 'Pure Jaggery Crystals', 'Cardamom pods'],
      keyNutrients: ['Iron-dense complex natural sugars'],
      healthBenefits: ['A smart, fiber-rich alternative to common refined white sugar sweets']
    }
  },
  'trad_ladoo_ast': {
    id: 'trad_ladoo_ast',
    name: 'Millet Ladoo Assortment',
    image: null,
    category: 'Traditional Value-Added Products',
    description: 'A gift-ready luxury collection box of variety multi-millet sweet ladoos formed with real cow ghee.',
    variants: [{ label: 'Box of 12 Ladoos', price: '₹399.00', originalPrice: '₹550.00' }],
    nutritionalInfo: {
      ingredients: ['Ragi Ladoo', 'Jowar Ladoo', 'Bajra Ladoo', 'Pure Ghee', 'Dry Fruit bits'],
      keyNutrients: ['Rich in fat-soluble vitamins, Clean Plant Proteins'],
      healthBenefits: ['Healthy traditional indulgence for family celebrations']
    }
  },
  'trad_sweet_pongal': {
    id: 'trad_sweet_pongal',
    name: 'Millet Sweet Pongal Mix',
    image: null,
    category: 'Traditional Value-Added Products',
    description: 'A sweet harvest delicacy premix mixing clean little grains and dark organic jaggery.',
    variants: [{ label: '400g', price: '₹165.00', originalPrice: '₹225.00' }],
    nutritionalInfo: {
      ingredients: ['Little Millet Flakes', 'Yellow Moong Dal', 'Jaggery Powder Blocks'],
      keyNutrients: ['Complex carbohydrates with mineral residues'],
      healthBenefits: ['Satisfies sweet cravings cleanly without driving insulin inflammation crashes']
    }
  },
  'trad_sweet_kanji': {
    id: 'trad_sweet_kanji',
    name: 'Millet Instant Kanji Mix',
    image: null,
    category: 'Traditional Value-Added Products',
    description: 'An ancient breakfast gruel mix optimized for quick workspace preparation. Highly grounding.',
    variants: [{ label: '500g', price: '₹155.00', originalPrice: '₹210.00' }],
    nutritionalInfo: {
      ingredients: ['Sprouted Kodo Millet', 'Roasted Lentils Powder', 'Spices mix'],
      keyNutrients: ['High Solubility Fiber Matrix'],
      healthBenefits: ['Soothes inflamed internal stomach walls and stabilizes early digestion tracks']
    }
  },

  // ==========================================
  // CATEGORY 7: COMPREHENSIVE KITS
  // ==========================================
  'kit_family_weekly': {
    id: 'kit_family_weekly',
    name: 'Weekly Millet Breakfast Kit for Family',
    images: [
      require('../../assets/magic-kit.png'),
      require('../../assets/magic-kit-new.png')
    ],
    category: 'Weekly Comprehensive Kits',
    description: 'The definitive all-in-one nutrition package. Contains 7 separate pre-measured breakfast modules engineered to support a family of four for a week.',
    highlight: 'Secure continuous health monitoring and unlock deep savings with our custom automatic Annual Subscription shipment plans.',
    variants: [
      { label: 'Weekly Kit (1 Unit Bundle)', price: '₹1299.00', originalPrice: '₹2499.00' },
      { label: 'Monthly Kit System (4 Unit Bundles)', price: '₹5596.00', originalPrice: '₹9596.00' },
      { label: 'Annual 12-Month Subscription (52 Bundles)', price: '₹69999.00', originalPrice: '₹114000.00' },
    ],
    nutritionalInfo: {
      ingredients: ['Millet Bisi Bele Bath Mix', 'Millet Khichdi Mix', 'Millet Noodles Mix', 'Millet Upma Mix', 'Millet Biryani Mix', 'Millet Dosa Mix', 'Millet Porridge'],
      keyNutrients: ['100% Active Sprouted Grains yielding optimal vitamin bioavailability frameworks'],
      healthBenefits: ['Covers comprehensive macro elements and vitamins across weekly family meals']
    }
  }
};