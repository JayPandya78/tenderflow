const mongoose = require("mongoose");
const { timeStamp } = require("node:console");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ORG", "TRADER", "ADMIN"],
        required: true
    },
}, {timestamps: true});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;