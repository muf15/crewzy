import express from "express";
import { 
  assignTask, 
  getAllTasks, 
  getTaskById, 
  updateTaskStatus, 
  deleteTask 
} from "../controllers/task.js";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Admin can assign/create a new task
router.post("/assign", authenticateJWT, authorizeRoles("admin"), assignTask);

// Get all tasks (admin can see all, employee can see their assigned tasks)
router.get("/", authenticateJWT, getAllTasks);

// Get specific task by ID
router.get("/:id", authenticateJWT, getTaskById);

// Update task status (mainly for employees to update progress)
router.put("/:id/status", authenticateJWT, updateTaskStatus);

// Delete task (admin only)
router.delete("/:id", authenticateJWT, authorizeRoles("admin"), deleteTask);

export default router;
