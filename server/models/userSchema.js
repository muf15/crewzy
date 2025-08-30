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
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (v) {
            if (!v || v.length === 0) return true; // Allow empty
            return (
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 && // longitude
              v[1] >= -90 &&
              v[1] <= 90
            ); // latitude
          },
          message:
            "Coordinates must be [longitude, latitude] with valid ranges",
        },
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

// Create geospatial index for location-based queries (only for documents with coordinates)
userSchema.index(
  { location: "2dsphere" },
  {
    sparse: true, // Only index documents that have the location field with valid data
  }
);

const User = mongoose.model("User", userSchema);
export default User;
