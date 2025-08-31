import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticateJWT = async (req, res, next) => {
  let token = null;
  // Accept token from Authorization header (Bearer or raw), x-access-token, body, or query
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      token = req.headers.authorization;
    }
  } else if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  } else if (req.body.token) {
    token = req.body.token;
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // Optionally fetch user from DB for fresh role
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user.role = user.role;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
