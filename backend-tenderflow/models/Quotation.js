const mongoose = require("mongoose");
const quotationDocumentSchema = new mongoose.Schema({
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

const quotationSchema = new mongoose.Schema({
    tender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tender",
        required: true
    },
    trader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    document: {
        type: quotationDocumentSchema,
        required: false
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        required: true,
        default: "PENDING"
    }
}, {timestamps: true});

quotationSchema.index({ tender: 1, trader: 1 }, { unique: true });

const QuotationModel = mongoose.model("Quotation", quotationSchema);

module.exports = QuotationModel;