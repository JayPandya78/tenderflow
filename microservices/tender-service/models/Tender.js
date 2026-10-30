const mongoose = require("mongoose");

const tenderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    deadline: {
        type: Date,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: [
            "OPEN",
            "EVALUATION",
            "AWARDED",
            "CLOSED"
        ],
        default: "OPEN"
    }
}, {timestamps: true});

const TenderModel = mongoose.model("Tender", tenderSchema);

module.exports = TenderModel;