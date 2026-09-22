require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function testBudget() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      process.env.MONGODB_URL
    );

    console.log("CONNECTED");

    const result = await User.collection.updateOne(
      { firebaseUid: "test123" },
      { $set: { budgetSpent: 1250 } }
    );

    console.log("MATCHED:", result.matchedCount);
    console.log("MODIFIED:", result.modifiedCount);

    const user = await User.collection.findOne({
      firebaseUid: "test123",
    });

    console.log("BUDGET SPENT VALUE:", user.budgetSpent);

    await mongoose.disconnect();
  } catch (error) {
    console.log("ERROR:", error.message);
  }
}

testBudget();