const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes.js");
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.get('/heath', (_request, _response) => {
  return _response.json({
    message: "Auth microservice working"
  })
});

app.listen(process.env.PORT, () => {
  console.log("Auth service running on port " + process.env.PORT);
});