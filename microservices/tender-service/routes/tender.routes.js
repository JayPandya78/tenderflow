const express = require("express");
const router = express.Router();

const Tender = require('../models/Tender');
const { client } = require("../config/redis");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");


router.post("/", auth, role("ORG"), async (req, res) => {
  try {
    const tender = await Tender.create({
      ...req.body,
      organization: req.user.id
    });

    // invalidate cache
    await client.del("tenders:open");

    res.json(tender);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const cached = await client.get("tenders:open");

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const tenders = await Tender.find({ status: "OPEN" });

    await client.set("tenders:open", JSON.stringify(tenders));

    res.json(tenders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/:id/award", auth, role("ORG"), async (req, res) => {
  try {
    const { id } = req.params;
    const { winnerQuotationId } = req.body;


    // update tender
    const tender = await Tender.findByIdAndUpdate(
      id,
      { status: "AWARDED" },
      { new: true }
    );

    // call quotation service using fetch
    const response = await fetch(
      `${process.env.QUOTATION_SERVICE_URL}/quotation/tender/${id}/award`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization
        },
        body: JSON.stringify({ winnerQuotationId })
      }
    );

    console.log(response); 


    if (!response.ok) {
      throw new Error("Failed to update quotations");
    }

    console.log("aagye yha tak"); 

    const data = await response.json();

    res.json({
      message: "Tender awarded",
      tender,
      quotationUpdate: data
    });

  } catch (err) {
    console.log("Hii"); 
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;