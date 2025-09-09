const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const QuoteSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  insuranceType: String,
  coverage: String,
  createdAt: { type: Date, default: Date.now }
});

const Quote = mongoose.model("Quote", QuoteSchema);

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Use for protected routes
router.post("/api/quote", async (req, res) => {
  try {
    const { name, email, phone, insuranceType, coverage } = req.body;
    if (!name || !phone || !insuranceType || !coverage) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const quote = new Quote({ name, email, phone, insuranceType, coverage });
    await quote.save();
    res.json({ message: "Quote request submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const res = await fetch("http://localhost:5000/api/quote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(values),
});

module.exports = router;