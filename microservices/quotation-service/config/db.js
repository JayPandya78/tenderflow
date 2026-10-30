const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const connectDB = async () => {
    try { 
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database'); 
    } catch(err) { 
        console.log("MongoDB Connection failed"); 
        console.log(err.message); 
        process.exit(1);
    }
}

module.exports = connectDB;