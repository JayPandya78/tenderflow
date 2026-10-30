const mongoose = require("mongoose");

const tenderDocumentSchema = new mongoose.Schema({
    storedName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
}, { _id: false });

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
    budget: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    document: {
        type: tenderDocumentSchema,
        required: false
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