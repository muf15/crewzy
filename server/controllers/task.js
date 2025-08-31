import Task from "../models/taskSchema.js";
import User from "../models/userSchema.js";

// Admin assigns/creates a new task
export const assignTask = async (req, res) => {
  try {
    console.log("Task assignment request body:", req.body);
    const { 
      name, 
      contactNo, 
      fullAddress, 
      pincode, 
      eLoc, 
      coordinates, 
      task, 
      expectedDate 
    } = req.body;

    // Validate required fields
    if (!name || !contactNo || !fullAddress || !task || !expectedDate) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["name", "contactNo", "fullAddress", "task", "expectedDate"] 
      });
    }

    // Create task data
    const taskData = {
      name: name.trim(),
      contactNo: contactNo.trim(),
      fullAddress: fullAddress.trim(),
      task: task.trim(),
      expectedDate: new Date(expectedDate),
      // These fields will be handled later as you mentioned:
      // assigneeId: not set initially (will be set when task is actually assigned)
      status: "new", // Default status for newly created tasks
      // revisitDate is optional and not set initially
    };

    // Add optional location fields if provided
    if (pincode) taskData.pincode = pincode.trim();
    if (eLoc) taskData.eLoc = eLoc.trim();
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      taskData.coordinates = coordinates;
    }

    console.log("Creating task with data:", taskData);
    
    const task_instance = new Task(taskData);
    await task_instance.save();

    res.status(201).json({ 
      message: "Task created successfully and ready for assignment", 
      task: task_instance 
    });
  } catch (error) {
    console.error("Task assignment error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error", 
        details: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks with role-based filtering
export const getAllTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === "admin") {
      // Admin can see all tasks
      tasks = await Task.find().populate("assigneeId", "name email role").sort({ createdAt: -1 });
    } else {
      // Employee can only see their assigned tasks
      tasks = await Task.find({ assigneeId: req.user.id }).sort({ createdAt: -1 });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get specific task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let task;
    if (req.user.role === "admin") {
      // Admin can see any task
      task = await Task.findById(id).populate("assigneeId", "name email role");
    } else {
      // Employee can only see their assigned tasks
      task = await Task.findOne({ _id: id, assigneeId: req.user.id });
    }

    if (!task) {
      return res.status(404).json({ error: "Task not found or access denied" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update task status (employees update progress, admin can update anything)
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, revisitDate } = req.body;

    // Validate status
    const validStatuses = ["new", "assigned", "inprogress", "completed", "revisit"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status", 
        validStatuses 
      });
    }

    let task;
    if (req.user.role === "admin") {
      // Admin can update any task
      task = await Task.findById(id);
    } else {
      // Employee can only update their assigned tasks
      task = await Task.findOne({ _id: id, assigneeId: req.user.id });
    }

    if (!task) {
      return res.status(404).json({ error: "Task not found or access denied" });
    }

    // Update fields
    if (status) task.status = status;
    if (revisitDate) task.revisitDate = new Date(revisitDate);

    await task.save();

    res.status(200).json({ 
      message: "Task updated successfully", 
      task 
    });
  } catch (error) {
    console.error("Update task status error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete task (admin only)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ 
      message: "Task deleted successfully",
      deletedTask: task 
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: error.message });
  }
};
