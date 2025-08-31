import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const signup = async (req, res) => {
  try {
    console.log("Signup request body:", req.body);
    const { 
      name, 
      email, 
      password, 
      role, 
      organization, 
      subRole, 
      workType, 
      fullAddress,
      pincode,
      eLoc,
      coordinates,
      skills 
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !organization) {
      console.log("Missing required fields:", { 
        name: !!name, 
        email: !!email, 
        password: !!password, 
        role: !!role, 
        organization: !!organization
      });
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["name", "email", "password", "role", "organization"],
        received: { 
          name: !!name, 
          email: !!email, 
          password: !!password, 
          role: !!role, 
          organization: !!organization
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user object...");
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      organization,
      skills: skills || []
    };

    // Add optional fields if provided
    if (subRole) userData.subRole = subRole;
    if (workType) userData.workType = workType;
    
    // Only add location info for employees, not admins
    if (role === "employee") {
      if (fullAddress) userData.fullAddress = fullAddress;
      if (pincode) userData.pincode = pincode;
      if (eLoc) userData.eLoc = eLoc;
      if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
        userData.coordinates = coordinates;
      }
    }

    console.log("User data to save:", userData);
    const user = new User(userData);

    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully:", user._id);

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ message: "Signup successful", token, user });
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error details:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};