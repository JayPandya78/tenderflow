const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRouter = require("./routes/auth.routes");
const tenderRouter = require("./routes/tender.routes");
const quotationRouter = require("./routes/quotation.routes");

const connectDB  = require("./config/db");
const {connectionRedis} = require('./config/redis');


connectDB();
connectionRedis().catch((err) => {
    console.error("Redis connection failed; continuing without cache:", err.message);
});

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (_request, _response) => {
    return _response.json({
        "success": true,
        "message": "API responding"
    });
});


app.use('/auth', authRouter);
app.use('/tender', tenderRouter);
app.use('/quotation', quotationRouter);

app.listen(process.env.BE_PORT, () => {
    console.log(`Backend listening at port ${process.env.BE_PORT}`);
});