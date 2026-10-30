const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (_request, file, callback) => {
        if (path.extname(file.originalname).toLowerCase() !== ".pdf" ||
            (file.mimetype && file.mimetype !== "application/pdf")) {
            return callback(new Error("Only PDF files are allowed"));
        }

        callback(null, true);
    }
});

const receivePdfUpload = (request, response, next) => {
    upload.single("document")(request, response, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return response.status(413).json({
                success: false,
                message: "PDF must be 10 MB or smaller"
            });
        }

        return response.status(400).json({
            success: false,
            message: err.message || "Unable to upload PDF"
        });
    });
};

const storePdf = async (file, directory) => {
    if (!file.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
        const error = new Error("The uploaded file is not a valid PDF");
        error.status = 400;
        throw error;
    }

    const storedName = `${randomUUID()}.pdf`;
    const filePath = path.join(directory, storedName);
    await fs.promises.mkdir(directory, { recursive: true });
    await fs.promises.writeFile(filePath, file.buffer, { flag: "wx" });

    return {
        filePath,
        document: {
            storedName,
            originalName: path.basename(file.originalname.replace(/\\/g, "/")),
            size: file.size
        }
    };
};

const getStoredPdfPath = (storedName, directory) => {
    if (!/^[0-9a-f-]+\.pdf$/i.test(storedName)) {
        throw new Error("Invalid stored PDF name");
    }

    return path.join(directory, storedName);
};

module.exports = { receivePdfUpload, storePdf, getStoredPdfPath };
