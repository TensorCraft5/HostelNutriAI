const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "User routes are working",
  });
});

// Get user by Firebase UID
router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.params.firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Update user by Firebase UID
// Update user by Firebase UID
router.put("/:firebaseUid", async (req, res) => {
  try {
    console.log("UPDATE REQUEST:");
    console.log("Firebase UID:", req.params.firebaseUid);
    console.log("Data:", req.body);

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      console.log("USER NOT FOUND");

      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("USER UPDATED:");
    console.log(updatedUser);

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
});


module.exports = router;