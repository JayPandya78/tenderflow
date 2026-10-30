const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const quotationRouter = require("./routes/quotation.routes");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

connectDB(); 

app.use("/quotation", quotationRouter);

app.listen(process.env.PORT, () => {
  console.log(`Quotation service running on ${process.env.PORT}`);
});