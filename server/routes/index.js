import express from "express";
import companyRoutes from "./company.js";
import authRoutes from "./auth.js";
import locationRoutes from "./location.js";

const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Crewzy API is running" });
});

router.use("/company", companyRoutes);
router.use("/auth", authRoutes);
router.use("/location", locationRoutes);

export default router;
