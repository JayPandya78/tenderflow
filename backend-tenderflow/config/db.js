const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {

        const connection = await mongoose.connect(process.env.DB_URI);
        console.log("Connected to Database");

    } catch(err) {

        console.log("MongoDB connection failed");
        console.log(err.message);
        process.exit(1);
        
    }
}

module.exports = connectDB;