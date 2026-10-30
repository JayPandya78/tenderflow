const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const tenderRoutes = require("./routes/tender.routes");
const {connectionRedis} = require("./config/redis"); 
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

connectDB(); 
connectionRedis();

app.use("/tenders", tenderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Tender service running on ${process.env.PORT}`);
});