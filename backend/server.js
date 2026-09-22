// DNS configuration
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Import packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// User routes
app.use("/api/users", userRoutes);
// Direct test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server test route is working",
  });
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "HostelNutriAI backend is running",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start server
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });