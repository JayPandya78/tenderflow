const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {

        console.log("hello world")
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");

    } catch(err) {

        console.log("MongoDB connection failed");
        console.log(err.message);
        process.exit(1);
        
    }
}

module.exports = connectDB;