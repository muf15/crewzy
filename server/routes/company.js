import express from "express";

const router = express.Router();
import { registerCompany } from "../controllers/company.js";

// POST /register - Register a new company
router.post("/register", registerCompany);

export default router;