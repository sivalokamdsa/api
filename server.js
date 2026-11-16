// server.js
require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET, // keep in environment variables
});

app.post("/api/create-order", async (req, res) => {
  const order = await razorpay.orders.create({
    amount: 49900, // ₹499 in paise
    currency: "INR",
    receipt: "rcpt_" + Date.now(),
  });
  res.json(order);
});

app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expected === razorpay_signature) {
    // Mark the course as paid for this user here
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

app.listen(3000, () => console.log("Running on port 3000"));
