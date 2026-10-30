const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { receivePdfUpload, storePdf, getStoredPdfPath } = require("../middleware/pdfUpload");
const TenderModel = require("../models/Tender");
const QuotationModel = require("../models/Quotation");

const quotationRouter = express.Router();
const uploadDirectory = path.join(__dirname, "..", "uploads", "quotations");

quotationRouter.get("/health", async (_request, _response) => {
    return _response.json({
        message: "Quotation router working..."
    });
});

// submit quotation 
quotationRouter.post("/", auth, role("TRADER"), receivePdfUpload, async (_request, _response) => {
    let storedDocumentPath;

    try {

        const {tenderId, price, timeline, proposal} = _request.body;

        if(!tenderId || !price || !timeline || !proposal) {
            return _response.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }
        //missing required fields

        const tender = await TenderModel.findById(tenderId);

        if (!tender) {
            return _response.status(404).json({
                message: "Tender not found",
                success: false
            });
        }
        //tender not found

        if(new Date() > tender.deadline) {
            return _response.status(400).json({
                message: "Deadline exceeded",
                success: false
            });
        }
        //deadline missed

        const existing = await QuotationModel.findOne({
            tender: tenderId,
            trader: _request.user._id
        });

        if (existing) {
            return _response.status(400).json({
                message: "You have already submitted a quotation for this tender",
                success: false,
            });
        }
        //to check if the trader has missed the tender deadline

        if (tender.status !== "OPEN") {
            return _response.status(400).json({
                message: "Tender not open anymore",
                success: false
            });
        };

        let document;
        if (_request.file) {
            const storedFile = await storePdf(_request.file, uploadDirectory);
            storedDocumentPath = storedFile.filePath;
            document = storedFile.document;
        }

        const quotation = await QuotationModel.create({
            tender: tenderId,
            trader: _request.user._id,
            price: price, 
            timeline: timeline,
            proposal: proposal,
            ...(document && { document })
        });

        return _response.status(200).json({
            success: true,
            data: quotation
        });
        //success


    } catch(err) {
        if (storedDocumentPath) {
            try {
                await fs.promises.unlink(storedDocumentPath);
            } catch (cleanupError) {
                console.error("Quotation PDF cleanup error:", cleanupError);
            }
        }

        console.error("Quotation submission error:", err);
        if (err.status === 400) {
            return _response.status(400).json({
                success: false,
                message: err.message
            });
        }

        return _response.status(500).json({
            messsage: "Server side error",
            error: err.message,
            success: false
        });
    }
});

quotationRouter.get("/organization", auth, role("ORG"), async (_request, _response) => {
    try {
        const tenders = await TenderModel.find(
            { organization: _request.user._id },
            { _id: 1 }
        ).lean();
        const tenderIds = tenders.map((tender) => tender._id);
        const quotations = await QuotationModel.find({ tender: { $in: tenderIds } })
            .populate("trader", "name email")
            .populate("tender", "title");

        return _response.status(200).json({
            success: true,
            data: quotations
        });
    } catch(err) {
        return _response.status(500).json({
            success: false,
            error: err.message,
            message: "Server side error"
        });
    }
});

quotationRouter.get("/:id/document", auth, async (_request, _response) => {
    try {
        const quotation = await QuotationModel.findById(_request.params.id)
            .populate("tender", "organization");

        if (!quotation || !quotation.document) {
            return _response.status(404).json({
                success: false,
                message: "Quotation PDF not found"
            });
        }

        const isTrader = _request.user.role === "TRADER" &&
            quotation.trader.toString() === _request.user._id.toString();
        const isOrganization = _request.user.role === "ORG" &&
            quotation.tender?.organization?.toString() === _request.user._id.toString();

        if (!isTrader && !isOrganization) {
            return _response.status(403).json({
                success: false,
                message: "You are not authorized to view this PDF"
            });
        }

        const filePath = getStoredPdfPath(quotation.document.storedName, uploadDirectory);
        const file = await fs.promises.readFile(filePath);
        _response.set({
            "Content-Type": "application/pdf",
            "Content-Length": file.length,
            "Content-Disposition": `inline; filename="quotation.pdf"; filename*=UTF-8''${encodeURIComponent(quotation.document.originalName)}`,
            "X-Content-Type-Options": "nosniff"
        });
        return _response.send(file);
    } catch(err) {
        if (err.code === "ENOENT") {
            return _response.status(404).json({
                success: false,
                message: "Quotation PDF file is missing"
            });
        }

        console.error("Quotation PDF retrieval error:", err);
        return _response.status(500).json({
            success: false,
            message: "Unable to retrieve quotation PDF"
        });
    }
});


// get my quotations 
quotationRouter.get("/my", auth, role("TRADER"), async (_request, _response) => {
    try {

        const myTenders = await QuotationModel.find({
            trader: _request.user._id,
        }).populate({
            path: "tender",
            populate: { path: "organization", select: "name email" }
        });

        return _response.status(200).json({
            data: myTenders,
            success: true
        });
        
    } catch(err) {
        return _response.status(500).json({
            success: false,
            error: err.message,
            message: "Server side error"
        });
    }
});


// get quotations for tenders (router for organizations)
quotationRouter.get("/tender/:id", auth, role("ORG"), async (_request, _response) => {
    try {

        const tender = await TenderModel.findById(_request.params.id);

        if(!tender) {
            return _response.status(404).json({
                success: false,
                message: "Tender not found" 
            });
        }
        
        //only organizations can see        
        if (tender.organization.toString() != _request.user._id.toString()) {
            return _response.status(401).json({
                message: "You are not authorized to use this route",
                success: false
            });
        }

        const quotations = await QuotationModel.find({tender: _request.params.id}).populate("trader", "name email");

        return _response.status(200).json({
            data: quotations,
            success: true
        });

    } catch(err) {
        return _response.status(500).json({
            success: false,
            error: err.message,
            message: "Server side error"
        });
    }
});


module.exports = quotationRouter;
