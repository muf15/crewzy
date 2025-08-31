import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "employee"],
    },
    organization: {
      type: String,
      required: true,
    },
    subRole: {
      type: String,
    },
    workType: {
      type: String,
      enum: ["office", "hybrid"],
    },
    fullAddress: {
      type: String,
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
        message:
          "Coordinates must be an array of [longitude, latitude] or empty",
      },
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create index on email for faster lookups
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User;
