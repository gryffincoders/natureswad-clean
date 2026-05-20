// app/constants/productsData.ts

export const PRODUCTS = {
  // --- ATTA, GRAINS & MILLETS ---
  'a1': {
    id: 'a1',
    name: 'Black Wheat Flour (Atta) Or Rava (Daliya)',
    image: require('../../assets/black-wheat.png'), 
    category: 'Atta & Grains',
    description: `Health Benefits of Black Wheat Flour:
• Rich in Antioxidants (Anthocyanin): Black wheat contains anthocyanin — powerful antioxidants that help reduce inflammation, support heart health, and may protect against certain cancers.
• Low Glycemic Index (GI): Helps regulate blood sugar levels, making it a better option for diabetics compared to regular wheat flour.
• High in Dietary Fiber: Promotes better digestion, prevents constipation, and supports a healthy gut.
• Improves Heart Health: The antioxidant and fiber content may help reduce bad cholesterol (LDL) and improve overall cardiovascular health.
• Weight Management Support: Keeps you full longer, helping in appetite control and weight management.
• Boosts Immunity: Contains essential nutrients like iron, zinc, and vitamins that support immune function.
• Gluten Content: Slightly lower gluten content compared to white wheat — potentially easier to digest for some people.
• Supports Brain Health: The anthocyanin may also improve cognitive function and delay age-related memory decline.`,
    variants: [
      { label: 'Black Wheat Flour (Atta) 1 Kg.', price: '₹299.00', originalPrice: '₹399.00' },
      { label: 'Black Wheat Flour (Atta) 5 Kg.', price: '₹1489.00', originalPrice: '₹1950.00' },
      { label: 'Black Wheat Rava (Daliya) 1 Kg.', price: '₹329.00', originalPrice: '₹429.00' },
      { label: 'Black Wheat Rava (Daliya) 5 Kg.', price: '₹1599.00', originalPrice: '₹2100.00' },
    ],
    nutritionalInfo: {
      ingredients: ['100% Black Wheat', 'No Preservatives', 'No Artificial Colors'],
      keyNutrients: [
        'Rich in Anthocyanin Antioxidants',
        'High in Dietary Fiber (12g per 100g)',
        'Low Glycemic Index',
        'Contains Iron, Zinc & Essential Vitamins'
      ],
      healthBenefits: [
        'Helps regulate blood sugar levels',
        'Supports heart health and reduces cholesterol',
        'Improves digestion and gut health',
        'Boosts immunity and cognitive function'
      ]
    }
  },

  'a2': {
    id: 'a2',
    name: 'Khapli Emmer Wheat Flour (Atta) Or Rava (Daliya) (100% Stone Grounded)',
    images: [
      require('../../assets/rava-daliya.png'),
      require('../../assets/Emmer-wheat-flour.png'),
      require('../../assets/Emmer-wheat-sooji.png'),


    ],
    category: 'Atta & Grains',
    description: `Health Benefits of Emmer (Khapli) Wheat:
• Lower Glycemic Index: Helps control blood sugar spikes. Beneficial for diabetics and people with insulin resistance.
• Higher Fiber Content: Aids digestion and promotes gut health. Improves satiety, helpful in weight management.
• More Protein and Micronutrients: Rich in magnesium, iron, zinc, and B-vitamins. Supports immune function, energy levels, and muscle repair.
• Less Refined: Emmer wheat flour is stone-ground or minimally processed. Retains bran and germ, making it more nutrient-dense.
• Better Tolerated by Some Gluten-Sensitive Individuals: Contains less gluten than regular wheat.`,
    variants: [
      { label: 'Khapli Emmer Wheat Flour (Atta) 1 kg.', price: '₹199.00', originalPrice: '₹299.00' },
      { label: 'Khapli Emmer Wheat Flour (Atta) 5 Kg.', price: '₹975.00', originalPrice: '₹1490.00' },
      { label: 'Khapli Emmer Wheat Rava (Daliya) 1 Kg.', price: '₹219.00', originalPrice: '₹329.00' },
      { label: 'Khapli Emmer Wheat Rava (Daliya) 5 Kg.', price: '₹1145.00', originalPrice: '₹1600.00' },
    ],
    nutritionalInfo: {
      ingredients: ['100% Khapli Emmer Wheat', 'No maida added. 100% wheat.'],
      keyNutrients: [
        'Emmer Wheat Flour (Per 100g): Calories 340, Protein 13g, Total Fat 2.5g, Carbohydrate 72g',
        'Emmer Wheat Sooji (Per 100g): Calories 343, Protein 15g, Total Fat 1.2g, Carbohydrate 69g',
        'Rich in fiber, protein, magnesium and other vitamins'
      ],
      healthBenefits: [
        'Lower amounts of gluten than regular wheat',
        'Low GI keeps blood glucose and insulin levels under control',
        'Great for diabetics'
      ]
    }
  },

  'g1': {
    id: 'g1',
    name: 'White Jowar',
    // image: require('../../assets/placeholder.png'),
    category: 'Atta & Grains',
    description: 'White jowar is high in iron, zinc and calcium. It helps to control obesity and arthritis and Lowers cholesterol and BP.',
    variants: [{ label: '1 Kg', price: '₹120.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['White Jowar'],
      keyNutrients: ['Calories: 330, Protein: 10g, Total Fat: 2g, Carbohydrate: 68g (Per 100g)'],
      healthBenefits: ['High iron, zinc and calcium', 'Helps to control obesity and arthritis', 'Lowers cholesterol and BP']
    }
  },

  'g2': {
    id: 'g2',
    name: 'Organic Wheat',
    // image: require('../../assets/placeholder.png'),
    category: 'Atta & Grains',
    description: 'High in Nutrients and fiber, Power Packed with Energy, Calorie Friendly.',
    variants: [{ label: '1 Kg', price: '₹90.00', originalPrice: '₹120.00' }],
    nutritionalInfo: {
      ingredients: ['Organic Wheat'],
      keyNutrients: ['Calories: 320, Protein: 11g, Total Fat: 1.5g, Carbohydrate: 65g (Per 100g)'],
      healthBenefits: ['High in Nutrients and fiber', 'Power Packed with Energy', 'Calorie Friendly']
    }
  },

  'm1': {
    id: 'm1',
    name: 'Proso Millet',
     image: require('../../assets/Proso-millet.png'),
    category: 'Atta & Grains',
    description: 'High in protein, crude fiber, minerals and calcium. Healthy heart, Prevent diabetes and Strengthen bones.',
    variants: [{ label: '500g', price: '₹110.00', originalPrice: '₹140.00' }],
    nutritionalInfo: {
      ingredients: ['Proso Millet'],
      keyNutrients: ['Calories: 363, Protein: 11g, Total Fat: 3g, Carbohydrate: 71g (Per 100g)'],
      healthBenefits: ['High in protein, crude fiber, minerals and calcium', 'Healthy heart, Prevent diabetes and Strengthen bones']
    }
  },

  'm2': {
    id: 'm2',
    name: 'Kodo Millet',
     image: require('../../assets/Kodo-millet.png'),
    category: 'Atta & Grains',
    description: 'It has the highest dietary fiber amongst all the millets. Anti-diabetic, Antioxidant, Anti-cholesterol and anti-hypertension.',
    variants: [{ label: '500g', price: '₹120.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['Kodo Millet'],
      keyNutrients: ['Calories: 353, Protein: 8g, Total Fat: 3g, Carbohydrate: 72g (Per 100g)'],
      healthBenefits: ['It has the highest dietary fiber amongst all the millets', 'Anti-diabetic, Antioxidant, Anti-cholesterol and anti-hypertension']
    }
  },

  'm3': {
    id: 'm3',
    name: 'Barnyard Millet',
     image: require('../../assets/Barnyard-millet.png'),
    category: 'Atta & Grains',
    description: 'Low in calorie, low GI. Rich in fiber and iron, gluten free.',
    variants: [{ label: '500g', price: '₹130.00', originalPrice: '₹160.00' }],
    nutritionalInfo: {
      ingredients: ['Barnyard Millet'],
      keyNutrients: ['Calories: 307, Protein: 6g, Total Fat: 2g, Carbohydrate: 66g (Per 100g)'],
      healthBenefits: ['Low in calorie, low GI', 'Rich in fiber and iron, gluten free']
    }
  },

  'm4': {
    id: 'm4',
    name: 'Foxtail Millet',
    // image: require('../../assets/placeholder.png'),
    category: 'Atta & Grains',
    description: 'It has double quantity of protein compared to rice. Diabetic friendly and aids in weight loss.',
    variants: [{ label: '500g', price: '₹115.00', originalPrice: '₹145.00' }],
    nutritionalInfo: {
      ingredients: ['Foxtail Millet'],
      keyNutrients: ['Calories: 331, Protein: 12g, Total Fat: 4g, Carbohydrate: 61g (Per 100g)'],
      healthBenefits: ['It has double quantity of protein compared to rice', 'Diabetic friendly and aids in weight loss']
    }
  },

  'm5': {
    id: 'm5',
    name: 'Finger Millet',
     image: require('../../assets/Finger-millet.png'),
    category: 'Atta & Grains',
    description: 'High amount of calcium, proteins and fiber. Low GI helps with weight loss and diabetes.',
    variants: [{ label: '500g', price: '₹90.00', originalPrice: '₹120.00' }],
    nutritionalInfo: {
      ingredients: ['Finger Millet'],
      keyNutrients: ['Calories: 321, Protein: 7g, Total Fat: 2g, Carbohydrate: 67g (Per 100g)'],
      healthBenefits: ['High amount of calcium, proteins and fiber', 'Low GI helps with weight loss and diabetes']
    }
  },

  'm6': {
    id: 'm6',
    name: 'Little Millet',
     image: require('../../assets/Little-millet.png'),
    category: 'Atta & Grains',
    description: 'Dietary fiber, Detoxifies the body. Lowers bad cholesterol and Prevents Type-II diabetes.',
    variants: [{ label: '500g', price: '₹125.00', originalPrice: '₹155.00' }],
    nutritionalInfo: {
      ingredients: ['Little Millet'],
      keyNutrients: ['Calories: 346, Protein: 10g, Total Fat: 4g, Carbohydrate: 66g (Per 100g)'],
      healthBenefits: ['Dietary fiber, Detoxifies the body', 'Lowers bad cholesterol and Prevents Type-II diabetes']
    }
  },

  'm7': {
    id: 'm7',
    name: 'Brown Top Millet',
     image: require('../../assets/Brown-top-millet.png'),
    category: 'Atta & Grains',
    description: 'Rich in fibre, iron, calcium, potassium, magnesium. Controls high BP and acts as a probiotic for respiratory disorders.',
    variants: [{ label: '500g', price: '₹140.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Brown Top Millet'],
      keyNutrients: ['Calories: 338, Protein: 10g, Total Fat: 2g, Carbohydrate: 71g (Per 100g)'],
      healthBenefits: ['Rich in fibre, iron, calcium, potassium, magnesium', 'Controls high BP and acts as a probiotic for respiratory disorders']
    }
  },

  'm8': {
    id: 'm8',
    name: 'Pearl Millet',
    // image: require('../../assets/placeholder.png'),
    category: 'Atta & Grains',
    description: 'It has high energy content compared to other millets. Rich in calcium and unsaturated fats.',
    variants: [{ label: '500g', price: '₹100.00', originalPrice: '₹130.00' }],
    nutritionalInfo: {
      ingredients: ['Pearl Millet'],
      keyNutrients: ['Calories: 348, Protein: 11g, Total Fat: 5g, Carbohydrate: 62g (Per 100g)'],
      healthBenefits: ['It has high energy content compared to other millets', 'Rich in calcium and unsaturated fats']
    }
  },

  // --- PULSES & DALS ---
  'p1': {
    id: 'p1',
    name: 'Chickpeas',
     image: require('../../assets/Chikpeas.png'),
    category: 'Pulses & Dals',
    description: 'Rich in plant based protein. Boosts Bone Health.',
    variants: [{ label: '500g', price: '₹120.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['Chickpeas'],
      keyNutrients: ['Calories: 378, Protein: 20g, Total Fat: 6g, Carbohydrate: 63g (Per 100g)'],
      healthBenefits: ['Rich in plant based protein', 'Boosts Bone Health']
    }
  },
  'p2': {
    id: 'p2',
    name: 'Green Gram',
     image: require('../../assets/Greengram.png'),
    category: 'Pulses & Dals',
    description: 'Rich in vitamins and minerals, weight and diabetes management and improves digestion.',
    variants: [{ label: '500g', price: '₹140.00', originalPrice: '₹170.00' }],
    nutritionalInfo: {
      ingredients: ['Green Gram'],
      keyNutrients: ['Calories: 294, Protein: 23g, Total Fat: 1g, Carbohydrate: 46g (Per 100g)'],
      healthBenefits: ['Rich in vitamins and minerals, weight and diabetes management and improves digestion']
    }
  },
  'p3': {
    id: 'p3',
    name: 'Horse Gram',
     image: require('../../assets/Horsegram.png'),
    category: 'Pulses & Dals',
    description: 'Rich in phosphorus, calcium, protein and iron. Treats health issues like asthma, skin disease, and kidney stone.',
    variants: [{ label: '500g', price: '₹110.00', originalPrice: '₹140.00' }],
    nutritionalInfo: {
      ingredients: ['Horse Gram'],
      keyNutrients: ['Calories: 330, Protein: 22g, Total Fat: 0.6g, Carbohydrate: 57g (Per 100g)'],
      healthBenefits: ['Rich in phosphorus, calcium, protein and iron', 'Treats health issues like asthma, skin disease, and kidney stone']
    }
  },
  'p4': {
    id: 'p4',
    name: 'Moth Beans',
    // image: require('../../assets/placeholder.png'),
    category: 'Pulses & Dals',
    description: 'High protein, fibre and energy. Rich in antioxidants and reduce the risks of cardiovascular disease.',
    variants: [{ label: '500g', price: '₹130.00', originalPrice: '₹160.00' }],
    nutritionalInfo: {
      ingredients: ['Moth Beans'],
      keyNutrients: ['Calories: 309, Protein: 20g, Total Fat: 2g, Carbohydrate: 52g (Per 100g)'],
      healthBenefits: ['High protein, fibre and energy', 'Rich in antioxidants and reduce the risks of cardiovascular disease']
    }
  },
  'p5': {
    id: 'p5',
    name: 'Cowpeas',
     image: require('../../assets/Cowpeas.png'),
    category: 'Pulses & Dals',
    description: 'Good sources of vegetarian protein. Excellent sources of several B-complex vitamins.',
    variants: [{ label: '500g', price: '₹120.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['Cowpeas'],
      keyNutrients: ['Calories: 320, Protein: 21g, Total Fat: 1g, Carbohydrate: 54g (Per 100g)'],
      healthBenefits: ['Good sources of vegetarian protein', 'Excellent sources of several B-complex vitamins']
    }
  },
  'p6': {
    id: 'p6',
    name: 'Urad Dal',
     image: require('../../assets/Urad-Dal.png'),
    category: 'Pulses & Dals',
    description: 'Richest sources of proteins, iron and vitamin B. Improves Bone Health.',
    variants: [{ label: '500g', price: '₹150.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Urad Dal'],
      keyNutrients: ['Calories: 324, Protein: 23g, Total Fat: 2g, Carbohydrate: 51g (Per 100g)'],
      healthBenefits: ['Richest sources of proteins, iron and vitamin B', 'Improves Bone Health']
    }
  },
  'p7': {
    id: 'p7',
    name: 'Moong Dal & Moong Dal Chilka',
     images: [
      require('../../assets/Moong-Dal.png'),
      require('../../assets/Moong-Dal-Chilka.png')
    ],
    category: 'Pulses & Dals',
    description: 'Rich in amino acid, calcium, fiber. Reduce the problems of constipation and blood cholesterol and sugar levels. Rich in Nutrients Improves Heart Health.',
    variants: [{ label: '500g', price: '₹140.00', originalPrice: '₹170.00' }],
    nutritionalInfo: {
      ingredients: ['Moong Dal & Moong Dal Chilka'],
      keyNutrients: [
        'Moong Dal (Per 100g): Calories 326, Protein 24g, Fat 1.3g, Carbs 53g',
        'Moong Dal Chilka (Per 100g): Calories 358, Protein 23g, Fat 2g, Carbs 62g'
      ],
      healthBenefits: ['Rich in amino acid, calcium, fiber', 'Reduce the problems of constipation and blood cholesterol and sugar levels', 'Rich in Nutrients Improves Heart Health']
    }
  },
  'p8': {
    id: 'p8',
    name: 'Channa Dal',
     image: require('../../assets/Channadal.png'),
    category: 'Pulses & Dals',
    description: 'Rich in Protein, fiber and iron. Reduces heart disease, Aids in weight loss and lower cholesterol.',
    variants: [{ label: '500g', price: '₹130.00', originalPrice: '₹160.00' }],
    nutritionalInfo: {
      ingredients: ['Channa Dal'],
      keyNutrients: ['Calories: 329, Protein: 22g, Total Fat: 5g, Carbohydrate: 47g (Per 100g)'],
      healthBenefits: ['Rich in Protein, fiber and iron', 'Reduces heart disease, Aids in weight loss and lower cholesterol']
    }
  },
  'p9': {
    id: 'p9',
    name: 'Toor Dal',
     image: require('../../assets/Toor-dal.png'),
    category: 'Pulses & Dals',
    description: 'Rich iron, calcium and protein. Contains dietary fibres and Full of antioxidants.',
    variants: [{ label: '500g', price: '₹160.00', originalPrice: '₹190.00' }],
    nutritionalInfo: {
      ingredients: ['Toor Dal'],
      keyNutrients: ['Calories: 331, Protein: 22g, Total Fat: 1.5g, Carbohydrate: 55g (Per 100g)'],
      healthBenefits: ['Rich iron, calcium and protein', 'Contains dietary fibres and Full of antioxidants']
    }
  },
  'p10': {
    id: 'p10',
    name: 'Whole Masoor & Masoor Dal',
    images: [
      require('../../assets/Whole-Masoor.png'),
      require('../../assets/Masoor-Dal.png')
    ],
    category: 'Pulses & Dals',
    description: 'High in carbohydrates, iron and Low in fat & cholesterol. Nourishes teeth and bones. Rich in proteins and minerals and also Contains dietary fibres and vitamins.',
    variants: [{ label: '500g', price: '₹140.00', originalPrice: '₹170.00' }],
    nutritionalInfo: {
      ingredients: ['Whole Masoor & Masoor Dal'],
      keyNutrients: [
        'Whole Masoor (Per 100g): Calories 299, Protein 22g, Fat 0.6g, Carbs 48g',
        'Masoor Dal (Per 100g): Calories 322, Protein 24g, Fat 0.7g, Carbs 53g'
      ],
      healthBenefits: [
        'High in carbohydrates, iron and Low in fat & cholesterol',
        'Nourishes teeth and bones',
        'Rich in proteins and minerals and also Contains dietary fibres and vitamins'
      ]
    }
  },

  // --- HEALTHY BREAKFAST MIXES ---
  'b1': {
    id: 'b1',
    name: 'Healthy Breakfast Mixes (Idli & Upma)',
    // image: require('../../assets/placeholder.png'),
    category: 'Atta & Grains',
    description: 'Easy to prepare, healthy, tasty, and soft. To enhance nutritional content add steamed veggies. Gluten free, diabetic friendly and quick to make.',
    variants: [
      { label: 'Multi Millet Idli Mix 500g', price: '₹140.00', originalPrice: '₹180.00' },
      { label: 'Vermicelli Upma Mix 500g', price: '₹120.00', originalPrice: '₹150.00' },
      { label: 'Ragi Malt Vermicelli Upma Mix 500g', price: '₹130.00', originalPrice: '₹160.00' }
    ],
    nutritionalInfo: {
      ingredients: [
        'Multi Millet Idli Mix',
        'Vermicelli Upma Mix',
        'Ragi Malt Vermicelli Upma Mix'
      ],
      keyNutrients: [
        'Idli Mix (Per 100g): Calories 343, Protein 10g, Total Fat 3g, Carbohydrate 68g',
        'Vermicelli Upma (Per 100g): Calories 332, Protein 11g, Total Fat 0.7g, Carbohydrate 68g',
        'Ragi Malt Upma (Per 100g): Calories 380, Protein 12g, Total Fat 1g, Carbohydrate 78g'
      ],
      healthBenefits: [
        'Low GI, nutrient dense',
        'Full of calcium and fiber, helps with weight loss',
        'Healthy tasty and soft easy to prepare'
      ]
    }
  },

  // --- FLOURS & OTHER GRAINS ---
  'f1': {
    id: 'f1',
    name: 'Organic Wheat Rava & Flour',
    // image: require('../../assets/placeholder.png'),
    category: 'Atta & Grains',
    description: 'High in Nutrients and fiber, Power Packed with Energy, Calorie Friendly. Boosts energy, Keeps bones and nervous system healthy.',
    variants: [{ label: '1 Kg', price: '₹150.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Organic Wheat Rava', 'Organic Wheat Flour', 'No maida added'],
      keyNutrients: [
        'Rava (Per 100g): Calories 334, Protein 11g, Fat 0.7g, Carbs 68g',
        'Flour (Per 100g): Calories 320, Protein 11g, Fat 1.5g, Carbs 64g'
      ],
      healthBenefits: ['Rich in protein, fiber, and B vitamins', 'High in Nutrients and fiber', 'Power Packed with Energy, Calorie Friendly']
    }
  },
  'f2': {
    id: 'f2',
    name: 'Multi Millet Flour',
    image: require('../../assets/Multi-millet-flour.png'),
    category: 'Atta & Grains',
    description: 'Gluten free, rich in dietary fiber, controls diabetes and helps in preventing celiac disease.',
    variants: [{ label: '1 Kg', price: '₹220.00', originalPrice: '₹260.00' }],
    nutritionalInfo: {
      ingredients: ['Multi Millet Flour', 'No maida added. 100% millets.'],
      keyNutrients: ['Calories: 332, Protein: 9g, Total Fat: 3g, Carbohydrate: 67g (Per 100g)'],
      healthBenefits: ['Gluten free, rich in dietary fiber, controls diabetes and helps in preventing celiac disease']
    }
  },
  'f3': {
    id: 'f3',
    name: 'Bajra Flour',
     image: require('../../assets/Bajra-flour.png'),
    category: 'Atta & Grains',
    description: 'Gluten Free. Manage Diabetes and protect gut health. Packed With Omega-3 Fats and antioxidants.',
    variants: [{ label: '1 Kg', price: '₹140.00', originalPrice: '₹170.00' }],
    nutritionalInfo: {
      ingredients: ['Bajra Flour'],
      keyNutrients: ['Calories: 348, Protein: 11g, Total Fat: 5g, Carbohydrate: 62g (Per 100g)'],
      healthBenefits: ['Gluten Free. Manage Diabetes and protect gut health', 'Packed With Omega-3 Fats and antioxidants']
    }
  },
  'f4': {
    id: 'f4',
    name: 'Jowar Flour & Daliya',
    images: [
      require('../../assets/Jowar-Daliya.png'),
      require('../../assets/Jowar-Flour.png')
    ],
    category: 'Atta & Grains',
    description: 'High iron, zinc and calcium. Gluten-free, high-protein, dietary fiber and iron. Diabetic friendly, aids in weight loss.',
    variants: [{ label: '1 Kg', price: '₹160.00', originalPrice: '₹190.00' }],
    nutritionalInfo: {
      ingredients: ['Jowar Daliya', 'Jowar Flour'],
      keyNutrients: [
        'Daliya (Per 100g): Calories 350, Protein 11g, Fat 2g, Carbs 73g',
        'Flour (Per 100g): Calories 334, Protein 10g, Fat 1.7g, Carbs 68g'
      ],
      healthBenefits: ['Gluten-free, high-protein, dietary fiber and iron', 'Diabetic friendly, aids in weight loss', 'Helps to control obesity and arthritis and Lowers cholesterol and BP']
    }
  },
  'f5': {
    id: 'f5',
    name: 'Channa Flour',
    image: require('../../assets/Channa-Flour.png'),
    category: 'Atta & Grains',
    description: 'Provides calories, Contains dietary fiber and Rich in iron and calcium.',
    variants: [{ label: '500g', price: '₹120.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['Channa Flour'],
      keyNutrients: ['Calories: 387, Protein: 22g, Total Fat: 6.6g, Carbohydrate: 58g (Per 100g)'],
      healthBenefits: ['Provides calories, Contains dietary fiber and Rich in iron and calcium']
    }
  },
  'f6': {
    id: 'f6',
    name: 'Finger Millet Flour',
     image: require('../../assets/Finger-Millet-Flour.png'),
    category: 'Atta & Grains',
    description: 'High amount of calcium, proteins and fiber. Low glycemic index, helps with weight loss and diabetes.',
    variants: [{ label: '1 Kg', price: '₹150.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Finger Millet Flour'],
      keyNutrients: ['Calories: 325, Protein: 7g, Total Fat: 1g, Carbohydrate: 72g (Per 100g)'],
      healthBenefits: ['High amount of calcium, proteins and fiber', 'Low glycemic index, helps with weight loss and diabetes']
    }
  },
  'f7': {
    id: 'f7',
    name: 'Corn Flour',
    image: require('../../assets/Corn-Flour.png'),
    category: 'Atta & Grains',
    description: 'Gluten free, Rich in fiber, Great source of antioxidants. Supports digestive health.',
    variants: [{ label: '500g', price: '₹90.00', originalPrice: '₹120.00' }],
    nutritionalInfo: {
      ingredients: ['Corn Flour'],
      keyNutrients: ['Calories: 360, Protein: 1.2g, Total Fat: 2g, Carbohydrate: 77g (Per 100g)'],
      healthBenefits: ['Gluten free, Rich in fiber, Great source of antioxidants', 'Supports digestive health']
    }
  },

  // --- EXISTING HEALTH CARE ---
  'h1': {
    id: 'h1',
    name: 'Diabetic Care Bliss',
    image: require('../../assets/diabetic-care.png'),
    category: 'Health Care',
    description: `Diabetic Care Bliss is a specially formulated natural blend of sprouted millets, pulses and grains which are procured from FPOs. Specially crafted for diabetes and comprehensive nutritional care.`,
    variants: [
      { label: '1 Kg.', price: '₹599.00', originalPrice: '₹699.00' }
    ],
    nutritionalInfo: {
      ingredients: ['Sprouted Millets', 'Pulses', 'Grains', 'Moringa', 'Natural Herbs', 'Dry Fruits'],
      keyNutrients: [
        'Moringa (Per 100g): Calories 63, Protein 6g, Fat 1.6g, Carbohydrate 5.6g',
        'Rich in antioxidants',
        'Contains Slow Digesting Starch (SDS)'
      ],
      healthBenefits: [
        'Lowers blood sugar levels',
        'Reduces Inflammation boost energy, multivitamin supplement',
        'Increases HDL (good cholesterol), reduces LDL (bad cholesterol)'
      ]
    }
  },

  'h3': {
    id: 'h3',
    name: 'Millet Peanut Sesame Jaggery Laddu',
    image: require('../../assets/jaggery-laddu.png'),
    category: 'Health Care',
    description: `A nutritious fusion of ancient grains and traditional Indian flavors.`,
    variants: [
      { label: 'Millet Peanut jaggery laddu (Pack of 4)', price: '₹499.00', originalPrice: '₹699.00' }
    ],
    nutritionalInfo: {
      ingredients: ['Millet Flour', 'Peanuts', 'White Sesame', 'Jaggery Powder', 'No Preservatives'],
      keyNutrients: [
        'White Sesame (Per 100g): Calories 520, Protein 22g, Total Fat 43g, Carbohydrate 11g, Calcium 1283mg',
        'Peanuts (Per 100g): Calories 567, Protein 26g, Total Fat 50g, Carbohydrate 16g',
        'Jaggery Powder (Per 100g): Calories 354, Protein 2g, Total Fat 0.16g, Carbohydrate 85g, Sugar 84g'
      ],
      healthBenefits: [
        'Good source of healthy fats, calcium, protein, B vitamins, Boosts bone health',
        'Good source of healthful fats, protein, and fiber and low in carbs, Lowers the risk of heart disease and stroke',
        'Prevents constipation by aiding digestion. Rich in antioxidants, iron and minerals and Acts as a detox'
      ]
    }
  },

  'h4': {
    id: 'h4',
    name: 'Millet Pasta / Noodles / Macaroni',
    image: require('../../assets/millet-pasta.png'),
    category: 'Health Care',
    description: `Upgrade your everyday meals with our Millet Pasta, Noodles, and Macaroni.`,
    variants: [
      { label: 'Millet Pasta (500g)', price: '₹349.00', originalPrice: '₹499.00' },
    ],
    nutritionalInfo: {
      ingredients: ['100% Multi Millet Flour', 'No Maida', 'No Artificial Colors', 'No Preservatives'],
      keyNutrients: [
        'Multi Millet Flour (Per 100g): Calories 332, Protein 9g, Total Fat 3g, Carbohydrate 67g',
        'No maida added. 100% millets'
      ],
      healthBenefits: [
        'Gluten free, rich in dietary fiber, controls diabetes and helps in preventing celiac disease',
        'Supports digestive health',
        'Healthy alternative to regular pasta'
      ]
    }
  },

  'h5': {
    id: 'h5',
    name: 'Millet Magic Morning Breakfast (7 Variety)',
    image: require('../../assets/morning-magic.png'),
    category: 'Health Care',
    description: `A nutritious weekly breakfast package crafted for all age groups. It contains 7 millet-based breakfast pouches, each weighing 250 grams.

Each pouch is designed for hassle-free, quick-cook preparation — ideal for modern, health-conscious families. Millets are naturally gluten-free, high in fiber, protein, and essential minerals such as iron and magnesium.

Contents:
• Millet Bisibele Bath Mix
• Millet Upma Mix
• Millet Noodles
• Millet Kichidi Mix
• Millet Biryani Mix
• Millet Dosa Mix
• Millet Ganji`,
    variants: [
      { label: 'Millet Bisibele Bath Mix (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
      { label: 'Millet Upma Mix (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
      { label: 'Millet Noodles (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
      { label: 'Millet Kichidi Mix (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
      { label: 'Millet Biryani Mix (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
      { label: 'Millet Dosa Mix (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
      { label: 'Millet Ganji (250 grams)', price: '₹249.00', originalPrice: '₹399.00' },
    ],
    nutritionalInfo: {
      ingredients: ['7 Millet Varieties', 'Natural Spices', 'Herbs', 'No Preservatives'],
      keyNutrients: [
        'Multi Millet Dosa Mix (Per 100g): Calories 370, Protein 13g, Total Fat 2g, Carbohydrate 72g',
        'Multi Millet Upma Mix (Per 100g): Calories 340, Protein 12g, Total Fat 4g, Carbohydrate 61g',
        'No maida added. 100% millets'
      ],
      healthBenefits: [
        'Instant super food, gluten free, low GI. Healthy and tasty',
        'Gluten free, heart healthy, aids digestion, rich in fiber',
        'Power packed with energy; add steamed veggies for taste'
      ]
    }
  },

  // --- SEEDS, SPICES & SWEETENERS ---
  's1': {
    id: 's1',
    name: 'Flaxseeds & Chutney',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'High in omega-3 fatty acids and fibre, Low in Carbs. Lowers Cholesterol. Best with jowar roti, curd.',
    variants: [{ label: '250g', price: '₹150.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Flaxseeds', 'chilli powder, garlic, salt'],
      keyNutrients: [
        'Flaxseeds (Per 100g): Calories 444, Protein 19g, Fat 36g, Carbs 11g',
        'Chutney (Per 100g): Protein 16g, Fat 30g, Carbs 9g'
      ],
      healthBenefits: ['High in omega-3 fatty acids and fibre, Low in Carbs and Cholesterol', 'Lowers Cholesterol']
    }
  },
  's2': {
    id: 's2',
    name: 'Organic Jaggery Variants (Cake, Powder, Ginger)',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Prevents constipation by aiding digestion. Rich in antioxidants, iron and minerals and Acts as a detox. Improves Digestion, Reduces Gas Trouble, Best for Cold and Throat Infection.',
    variants: [{ label: '500g', price: '₹140.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Organic Jaggery Cake', 'Ginger Jaggery', 'Jaggery Powder'],
      keyNutrients: ['Calories: 354, Protein: 2g, Total Fat: 0.16g, Carbohydrate: 85g, Sugar: 84g (Per 100g)'],
      healthBenefits: ['Prevents constipation by aiding digestion', 'Rich in antioxidants, iron and minerals and Acts as a detox', 'Improves Digestion, Reduces Gas Trouble']
    }
  },
  's3': {
    id: 's3',
    name: 'Wheat Grass Powder',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Rich in chlorophyll, amino acids, energy and dietary fiber. Regulates blood sugar levels and helps indigestion.',
    variants: [{ label: '200g', price: '₹350.00', originalPrice: '₹450.00' }],
    nutritionalInfo: {
      ingredients: ['Wheat Grass Powder'],
      keyNutrients: ['Calories: 286, Protein: 29g, Carbohydrate: 57g, Total Fiber: 28.6g (Per 100g)'],
      healthBenefits: ['Rich in chlorophyll, amino acids, energy and dietary fiber', 'Regulates blood sugar levels and helps indigestion']
    }
  },
  's4': {
    id: 's4',
    name: 'Turmeric Powder',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Antiseptic, anti-inflammatory, anti-cancer. Helps in wound healing and improves skin health. 100% all natural. No additives.',
    variants: [{ label: '250g', price: '₹150.00', originalPrice: '₹200.00' }],
    nutritionalInfo: {
      ingredients: ['Turmeric Powder'],
      keyNutrients: ['Calories: 312, Protein: 8g, Total Fat: 5g, Carbohydrate: 67g (Per 100g)'],
      healthBenefits: ['Antiseptic, anti-inflammatory, anti-cancer', 'Helps in wound healing and improves skin health']
    }
  },
  's5': {
    id: 's5',
    name: 'Organic Chilli Powders (Byadagi & Guntur)',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Offers colour, hot spice and pungency to food. Rich in vitamin-C, B6 and K1.',
    variants: [{ label: '250g', price: '₹180.00', originalPrice: '₹220.00' }],
    nutritionalInfo: {
      ingredients: ['Chilli powder organic', 'Byadagi chilli', 'Guntur chilli'],
      keyNutrients: ['Calories: 330, Protein: 12g, Total Fat: 6g, Carbohydrate: 50g (Per 100g)'],
      healthBenefits: ['Rich in vitamin-C B6 and K1', 'Natural food colorant', 'No artificial colour or preservatives added']
    }
  },

  // --- AUTHENTIC CHUTNEYS ---
  'ch_group': {
    id: 'ch_group',
    name: 'Authentic Healthy Chutneys (Assorted)',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'A collection of traditional, nutrient-dense chutneys to complement your meals. From powerful antioxidants that lower cholesterol, to being rich in essential oils that smoothen skin. Super foods that are inexpensive and packed with health benefits.',
    variants: [
      { label: 'Curry Leaves Chutney 200g', price: '₹140.00', originalPrice: '₹180.00' },
      { label: 'Niger Seeds Chutney 200g', price: '₹160.00', originalPrice: '₹200.00' },
      { label: 'Drumstick Leaves Chutney 200g', price: '₹150.00', originalPrice: '₹180.00' },
      { label: 'Groundnut Chutney 200g', price: '₹140.00', originalPrice: '₹180.00' },
      { label: 'Fenugreek Chutney Powder 200g', price: '₹130.00', originalPrice: '₹160.00' },
      { label: 'Horse Gram Chutney 200g', price: '₹130.00', originalPrice: '₹160.00' }
    ],
    nutritionalInfo: {
      ingredients: [
        'Curry Leaves, urad dal, chana dal, chilli powder, jeera, coriander seeds, asafoetida, garlic, black pepper, salt',
        'Niger seeds, chilli powder, garlic, salt',
        'Drumstick leaves, urad dal, chilli powder, jeera, coriander seeds, garlic, tamarind, salt',
        'Horse gram, urad dal, salt, jeera, chilli powder, garlic, asafoetida, jaggery',
        'Groundnuts, chilli powder, jeera, garlic, salt',
        'Fenugreek seeds, urad dal, chana dal, rice, wheat, asafoetida, ajwain, mustard, jeera, salt, coriander seeds, chilli powder'
      ],
      keyNutrients: [
        'Curry Leaves (Per 100g): Protein 16g, Total Fat 3.5g, Carbs 34g',
        'Niger Seeds (Per 100g): Protein 17g, Total Fat 34g, Carbs 20g',
        'Drumstick Leaves (Per 100g): Protein 15g, Total Fat 1.6g, Carbs 32g',
        'Horse Gram (Per 100g): Protein 15g, Total Fat 0.9g, Carbs 37g',
        'Groundnut (Per 100g): Protein 21g, Total Fat 43g, Carbs 19g',
        'Fenugreek (Per 100g): Protein 16g, Total Fat 3g, Carbs 58g'
      ],
      healthBenefits: [
        'Boosts digestion, good for hair growth',
        'Smoothens skin and lowers cholesterol',
        'Good source of iron, protein and has lots of health benefits',
        'Reducing cholesterol, helps in weight loss and remedy for cold and cough',
        'Good source of healthful fats, protein, fiber and low in carbs',
        'Loaded with proteins and nutrients'
      ]
    }
  },

  // --- PICKLES & OILS ---
  'po1': {
    id: 'po1',
    name: 'Green Chilli Pickle',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Spicy and tangy condiment prepared from fresh and tender green chillies with oil, salt and spices. No preservatives and additives.',
    variants: [{ label: '250g', price: '₹120.00', originalPrice: '₹150.00' }],
    nutritionalInfo: {
      ingredients: ['Green Chillies, Oil, Rock Salt, Mustard Seeds, Distilled Vinegar, Fenugreek Seeds, Ajwain Seeds, Turmeric'],
      keyNutrients: ['Protein: 1g, Total Fat: 2g, Carbohydrate: 8g (Per 20g)'],
      healthBenefits: ['Spicy and tangy condiment prepared from fresh and tender green chillies', 'No preservatives and additives']
    }
  },
  'po2': {
    id: 'po2',
    name: 'Sweet Lime Pickle',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Perfect sweet & sour taste to your food. No preservatives and additives.',
    variants: [{ label: '250g', price: '₹130.00', originalPrice: '₹160.00' }],
    nutritionalInfo: {
      ingredients: ['lemon, sugar, red chilli, salt'],
      keyNutrients: ['Protein: 0.22g, Sugar: 15g, Carbohydrate: 16g (Per 20g)'],
      healthBenefits: ['Perfect sweet & sour taste to your food', 'No preservatives and additives']
    }
  },
  'po3': {
    id: 'po3',
    name: 'Bitter Gourd Pickle',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Spicy and tangy, rich in flavour, authentic recipe, Anti- diabetic, stimulates digestion. No preservatives and additives.',
    variants: [{ label: '250g', price: '₹140.00', originalPrice: '₹170.00' }],
    nutritionalInfo: {
      ingredients: ['bitter gourd, chilli, oil, salt, ginger, garlic, mustard, cumin'],
      keyNutrients: ['Protein: 1g, Total Fat: 5g, Carbohydrate: 2g (Per 20g)'],
      healthBenefits: ['Spicy and tangy, rich in flavour, authentic recipe', 'Anti- diabetic, stimulates digestion']
    }
  },
  'po4': {
    id: 'po4',
    name: 'Mango Pickle',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'The pickle is the original recipe of the village ladies and is made with the best hand-picked mangoes.',
    variants: [{ label: '250g', price: '₹150.00', originalPrice: '₹180.00' }],
    nutritionalInfo: {
      ingredients: ['Raw Mangoes, edible vegetable Oil, Salt, mustard, Fenugreek, Turmeric, red Chilli, asafoetida'],
      keyNutrients: ['Sodium: 1070mg, Total Fat: 2g, Carbohydrate: 5g (Per 30g)'],
      healthBenefits: ['The pickle is the original recipe of the village ladies and is made with the best hand-picked mangoes', 'No preservatives and additives']
    }
  },
  'po5': {
    id: 'po5',
    name: 'Cold Pressed Oils (Safflower & Groundnut)',
    // image: require('../../assets/placeholder.png'),
    category: 'Health Care',
    description: 'Oil has its original flavour and natural goodness. Promotes good health. It improves general health and energy. Natural, pure, chemical free.',
    variants: [{ label: '1 Litre', price: '₹350.00', originalPrice: '₹450.00' }],
    nutritionalInfo: {
      ingredients: ['Cold Pressed Safflower', 'Finest quality ground nuts'],
      keyNutrients: ['Calories: 884, Total Fat: 100g (Per 100g)'],
      healthBenefits: ['Oil has its original flavour and natural goodness', 'Promotes good health', 'It improves general health and energy', 'Natural, pure, chemical free']
    }
  },

  // --- EXISTING COMBOS ---
  'c1': {
    id: 'c1',
    name: 'Millet Magic Morning Breakfast Kit For Family',
    images: [
      require('../../assets/magic-kit.png'),
      require('../../assets/magic-kit-new.png')
    ],
    category: 'Combo',
    description: `The Millet Magic Morning Kit is a nutritious weekly breakfast package crafted for all age groups. It contains 7 millet-based breakfast pouches, each weighing 250 grams, making it sufficient to serve a family of four per day.

Each pouch in the kit is designed for hassle-free, quick-cook preparation — ideal for modern, health-conscious families. Millets are naturally gluten-free, high in fiber, protein, and essential minerals such as iron and magnesium, making them a great substitute for rice or wheat in daily meals.

Contents of the Weekly Kit (7 millet breakfast pouches included):
• Millet Bisibele Bath Mix – a hearty South Indian comfort food with a fusion of lentils, millets, and spices.
• Millet Upma Mix – a gluten-free alternative to traditional rava upma, made with little or foxtail millet for high fiber and energy.
• Millet Noodles – healthy millet-based noodles suitable for kids and adults alike, with better digestion and lower glycemic impact.
• Millet Kichidi Mix – a gentle and protein-rich meal made using barnyard or kodo millet mixed with moong dal and mild spices.
• Millet Biryani Mix – aromatic spiced millet blend replacing traditional rice for a wholesome, flavourful lunch option.
• Millet Dosa Mix – savory premix for crisp, protein-packed millets dosas that cook quickly with minimal preparation.
• Millet Ganji – highly nutritious millet porridge.

Nutritional Highlights:
Made primarily from Little Millet, Foxtail Millet, Kodo Millet, and Barnyard Millet — each sprout-activated for improved digestion and nutrient absorption.`,
    highlight: `Unlock exclusive savings and hassle-free deliveries with our Annual Subscription Plan! Subscribe once and enjoy amazing discounts while we take care of the rest — your premium kit will arrive every month before the 10th, right on schedule. That's 52 kits a year, delivered with consistency, care, and value you'll love. Join today and make every month feel effortless!`,
    variants: [
      { label: 'Weekly kit (1 No\'s)', price: '₹1299.00', originalPrice: '₹2499.00', promoText: '* Only applicable for first 1000 customers' },
      { label: 'Monthly Kit (4 No\'s)', price: '₹5596.00', originalPrice: '₹9596.00' },
      { label: '3 Months subscription (12 No\'s)', price: '₹16650.00', originalPrice: '₹28650.00' },
      { label: '6 Months subscription (24 No\'s)', price: '₹34000.00', originalPrice: '₹57000.00' },
      { label: 'Annual 12 months Subscription (52 No\'s)', price: '₹69999.00', originalPrice: '₹114000.00' },
    ],
    nutritionalInfo: {
      ingredients: ['7 Millet Products', 'Family Pack', 'All Natural Ingredients', 'No Preservatives'],
      keyNutrients: [
        'Multi Millet Dosa Mix (Per 100g): Calories 370, Protein 13g, Total Fat 2g, Carbohydrate 72g',
        'Multi Millet Upma Mix (Per 100g): Calories 340, Protein 12g, Total Fat 4g, Carbohydrate 61g',
        'No maida added. 100% millets'
      ],
      healthBenefits: [
        'Instant super food, gluten free, low GI. Healthy and tasty',
        'Gluten free, heart healthy, aids digestion, rich in fiber',
        'Power packed with energy; add steamed veggies for taste'
      ]
    }
  }
};