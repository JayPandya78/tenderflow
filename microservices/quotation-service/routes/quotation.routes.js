const express = require("express");
const quotationRouter = express.Router();

const Quotation = require("../models/Quotation");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");


// ✅ CREATE QUOTATION (TRADER)
quotationRouter.post("/", auth, role("TRADER"), async (req, res) => {
  try {
    const quotation = await Quotation.create({
      ...req.body,
      trader: req.user.id,
    });

    res.json(quotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET MY QUOTATIONS
quotationRouter.get("/my", auth, role("TRADER"), async (req, res) => {
  try {
    const quotations = await Quotation.find({ traderId: req.user.id });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔥 AWARD LOGIC (IMPORTANT)
quotationRouter.post("/tender/:id/award", auth, role("ORG"), async (req, res) => {
  try {

    console.log('hello world'); 
    const { id } = req.params;
    const { winnerQuotationId } = req.body;

    // reject all
    await Quotation.updateMany(
      { tenderId: id },
      { status: "REJECTED" }
    );

    // accept winner
    await Quotation.findByIdAndUpdate(
      winnerQuotationId,
      { status: "ACCEPTED" }
    );

    res.json({ message: "Quotations updated" });

  } catch (err) {
    console.log("yhi chud rha he !!!")
    res.status(500).json({ message: err.message });
  }
});

module.exports = quotationRouter;