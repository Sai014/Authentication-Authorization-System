const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected route (admin only)
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "Welcome Admin! This is protected content." });
  }
);

module.exports = router;
