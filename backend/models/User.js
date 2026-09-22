const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
    },

    height: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    goal: {
      type: String,
    },

    dailyCalorieGoal: {
      type: Number,
      default: 2000,
    },
    monthlyBudget: {
  type: Number,
  default: 3000,
},


dailyWaterGoal: {
  type: Number,
  default: 3000,
},
dailyWaterIntake: {
  type: Number,
  default: 0,
},


dailyProteinGoal: {
  type: Number,
  default: 75,
},
dailyProteinIntake: { 
  type: Number, 
  default: 0 
},


calorieIntake: {
  type: Number,
  default: 0,
},

budgetSpent: {
  type: Number,
  default: 0,
},
expenseHistory: {
  type: [
    {
      amount: { type: Number, required: true },
      category: { type: String, default: 'Food' },
      description: { type: String, default: 'Food expense' },
      date: { type: Date, default: Date.now },
    },
  ],
  default: [],
},

    expenseHistory: {
    type: [
      {
        amount: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
          default: 'Food',
        },
        description: {
          type: String,
          default: 'Food expense',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

