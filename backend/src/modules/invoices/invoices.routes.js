const express = require("express");
const multer = require("multer");
const { scanBill, createInvoice, getInvoices, downloadInvoicePdf } = require("./invoices.controller");

// Multer setup for in-memory buffer to pass directly to Tesseract
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/scan", upload.single("bill"), scanBill);
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id/pdf", downloadInvoicePdf);

module.exports = router;
