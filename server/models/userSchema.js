import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    enum: ["admin", "employee"]
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
    type: String,
  },
  skills:[{
    type: String,
  }]
});

const User = mongoose.model("User", userSchema);
export default User;
