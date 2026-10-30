const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const TenderModel = require("../models/Tender");

const auth = require("../middleware/auth");
const role = require("../middleware/role");


const UserModel = require("../models/User");
const QuotationModel = require("../models/Quotation");
const {client} = require("../config/redis");
const { receivePdfUpload, storePdf, getStoredPdfPath } = require("../middleware/pdfUpload");

const tenderRouter = express.Router();
const uploadDirectory = path.join(__dirname, "..", "uploads", "tenders");

const invalidateOpenTenderCache = async () => {
    if (!client.isReady) return;

    try {
        await client.del("tenders:open");
    } catch (err) {
        console.error("Tender cache invalidation error:", err);
    }
};

tenderRouter.get("/health", (_request, _response) => {

    return _response.json({
        "message": "Tender router working..."
    });

});

// created tenders 
tenderRouter.post("/", auth, role("ORG"), receivePdfUpload, async (_request, _response) => {
  let storedDocumentPath;

  try {
    const { title, description, budget, category, deadline } = _request.body;

    if (!title || !budget || !deadline) {
      return _response.status(400).json({
        message: "Missing required fields... (title, budget, deadline)",
        success: false,
      });
    }

    let document;
    if (_request.file) {
      const storedFile = await storePdf(_request.file, uploadDirectory);
      storedDocumentPath = storedFile.filePath;
      document = storedFile.document;
    }

    const tender = await TenderModel.create({
      title,
      description,
      budget,
      category,
      deadline,
      organization: _request.user._id,
      ...(document && { document })
    });

    await invalidateOpenTenderCache();

    return _response.status(200).json({
      success: true,
      data: tender
    });

  } catch (err) {
    if (storedDocumentPath) {
      try {
        await fs.promises.unlink(storedDocumentPath);
      } catch (cleanupError) {
        console.error("Tender PDF cleanup error:", cleanupError);
      }
    }

    if (err.status === 400) {
      return _response.status(400).json({
        success: false,
        message: err.message
      });
    }

    console.error("Tender creation error:", err);
    return _response.status(500).json({
      message: "Server side error",
      error: err.message,
      success: false
    });
  }
});

tenderRouter.get("/my", auth, async (_request, _response) => {

    try {

        const openTenders = await TenderModel.find({ organization: _request.user._id}).populate("organization", "name email");

        return _response.json({
            success: true,
            data: openTenders 
        });
        
    } catch(err) {

        return _response.status(500).json({
            message: "Server side error",
            error: err.message,
            success: false
        });

    }
});


tenderRouter.get("/", auth, async (_request, _response) => {
  const key = "tenders:open";

  try {
    let cachedData;

    if (client.isReady) {
      try {
        cachedData = await client.get(key);

        if (cachedData) {
          return _response.json(JSON.parse(cachedData));
        }
      } catch (err) {
        console.error("Tender cache read error:", err);
      }
    }

    const openTenders = await TenderModel
      .find({ status: "OPEN" })
      .populate("organization", "name email")
      .lean();

    const responseData = {
      success: true,
      data: openTenders
    };

    if (client.isReady) {
      try {
        await client.setEx(key, 300, JSON.stringify(responseData));
      } catch (err) {
        console.error("Tender cache write error:", err);
      }
    }

    return _response.json(responseData);

  } catch (err) {
    console.error("Tender fetch error:", err);

    return _response.status(500).json({
      message: "Server side error",
      error: err.message,
      success: false
    });
  }
});

// update a tender owned by the organization
tenderRouter.put("/:id", auth, role("ORG"), async (_request, _response) => {
    try {
        const { title, description, budget, category, deadline } = _request.body;
        const tender = await TenderModel.findById(_request.params.id);

        if (!tender) {
            return _response.status(404).json({ success: false, message: "Tender not found" });
        }

        if (tender.organization.toString() !== _request.user._id.toString()) {
            return _response.status(403).json({ success: false, message: "Not enough permissions" });
        }

        Object.assign(tender, { title, description, budget, category, deadline });
        await tender.save();
        await invalidateOpenTenderCache();

        return _response.json({ success: true, data: tender, message: "Tender updated successfully" });
    } catch (err) {
        return _response.status(500).json({ success: false, message: "Server side error", error: err.message });
    }
});

tenderRouter.get("/:id/document", auth, async (_request, _response) => {
    try {
        const tender = await TenderModel.findById(_request.params.id).select("organization document");

        if (!tender || !tender.document) {
            return _response.status(404).json({
                success: false,
                message: "Tender PDF not found"
            });
        }

        const isTrader = _request.user.role === "TRADER";
        const isOrganization = _request.user.role === "ORG" &&
            tender.organization.toString() === _request.user._id.toString();

        if (!isTrader && !isOrganization) {
            return _response.status(403).json({
                success: false,
                message: "You are not authorized to view this PDF"
            });
        }

        const filePath = getStoredPdfPath(tender.document.storedName, uploadDirectory);
        const file = await fs.promises.readFile(filePath);
        _response.set({
            "Content-Type": "application/pdf",
            "Content-Length": file.length,
            "Content-Disposition": `inline; filename="tender.pdf"; filename*=UTF-8''${encodeURIComponent(tender.document.originalName)}`,
            "X-Content-Type-Options": "nosniff"
        });
        return _response.send(file);
    } catch(err) {
        if (err.code === "ENOENT") {
            return _response.status(404).json({
                success: false,
                message: "Tender PDF file is missing"
            });
        }

        console.error("Tender PDF retrieval error:", err);
        return _response.status(500).json({
            success: false,
            message: "Unable to retrieve tender PDF"
        });
    }
});

// get all open routes 
// tenderRouter.get("/", auth, async (_request, _response) => {

//     try {

//         const openTenders = await TenderModel.find().populate("organization", "name email");

//         return _response.json({
//             success: true,
//             data: openTenders 
//         });
        
//     } catch(err) {

//         return _response.status(500).json({
//             message: "Server side error",
//             error: err.message,
//             success: false
//         });

//     }
// });

// get single tender 
tenderRouter.get("/:id", async (_request, _response) => {

    try {

        const tender = await TenderModel.findById(_request.params.id).populate("organization", "name email");

        if (!tender) {
            return _response.status(404).json({
                success: false,
                message: "Tender not found"
            });
        }

        return _response.status(200).json({
            success: true,
            data: tender
        });

    } catch(err) {

        return _response.status(500).json({
            message: "Server side error",
            success: false,
            error: err.message
        });

    }

});

//award tender 
tenderRouter.post("/:id/award", auth, role("ORG"), async (_request, _response) => {
    try {

        const { quotationId } = _request.body;
        const tenderId = _request.params.id;

        if(!quotationId) { 
            return _response.status(400).json({
                message: "Quotation Id not found",
                success: false
            });
        }
        // to check if quotationId is present or not 

        const tender = await TenderModel.findById(tenderId);

        if(!tender) {
            return _response.status(404).json({
                message: "Tender not found",
                success: false
            });
        }
        // tender exists in db or not 

        if(tender.organization.toString() !== _request.user._id.toString()) {
            return _response.status(403).json({
                message: "Not enough permissions",
                success: false
            });
        }
        //only the owning organizations can execute this route
        
        if(tender.status !== "OPEN") {
            return _response.status(400).json({
                message: "Tender already awarded",
                success: false
            });
        }
        // if the tender is already awarded

        const quotation = await QuotationModel.findById(quotationId);

        if(!quotation){
            return _response.status(404).json({
                message: "Quotation not found",
                success: false
            });
        }

        if(quotation.tender.toString() !== tenderId){
            return _response.status(400).json({
                message: "Quotation does not belong to this tender",
                success: false
            });
        }
        // to see if the quotation belongs to this tender or not 

        quotation.status = "ACCEPTED";
        await quotation.save();

        await QuotationModel.updateMany(
            {
                tender: tenderId, 
                _id: {
                    $ne: quotationId
                }
            },
            {$set: {status: "REJECTED"}}
        );
        // rejected every other quotation than the one we wanna award 

        tender.status = "AWARDED";
        await tender.save();
        //saving the tender's status as accepted 

        return _response.status(200).json({
            success: true,
            message: "Tender awarded successfully"
        });

    } catch(err) {
        return _response.json({
            success: false,
            error: err.message,
            message: "Server side error"
        });
    }
});

module.exports = tenderRouter;
