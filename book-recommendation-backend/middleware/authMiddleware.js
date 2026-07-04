const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  // Extract token from standard HTTP Authorization header wrapper
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Isolates 'Bearer <TOKEN>'

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. Archival gate requires signature token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "VintageMahoganyLibrarySecretKey2026##!!");
    // Mount the user identity directly onto the request thread payload
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token Signature verification failure. Expired or altered ledger." });
  }
};

module.exports = verifyJWT;