import express from "express";
import Company from "../models/companySchema.js";

const router = express.Router();

// POST /register - Register a new company
router.post("/register", async (req, res) => {
  try {
        const { name, industryType, businessEmail, contactNos, companySize, fullAddress, workForceType } = req.body;
    const company = new Company({ name, industryType, businessEmail, contactNos, companySize, fullAddress, workForceType });
    await company.save();
    res.status(201).json({ message: "Company registered successfully", company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;