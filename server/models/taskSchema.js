import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    fullAddress: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
    },
    eLoc: {
        type: String,
    },
    coordinates: {
        type: [Number],
        validate: {
        validator: function (v) {
            return v.length === 0 || v.length === 2;
        },
        message: "Coordinates must be an array of [longitude, latitude] or empty",
        },
    },
    task: {
      type: String,
      required: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Made optional so admin can create tasks without assigning initially
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "assigned", "inprogress", "completed", "revisit"],
    },
    expectedDate: {
      type: Date,
      required: true,
    },
    revisitDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
