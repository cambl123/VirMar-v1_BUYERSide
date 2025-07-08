import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function protectSellerRoute(req, res, next) {
  try {
    // Extract token from cookie or Authorization header
    const authHeader = req.headers.authorization;
    const token =
      req.cookies.token ||
      (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Debug logs (optional during development)
    console.log("🔐 Token received:", token);
    console.log("🔑 Using seller secret:", process.env.JWT_SECRET_SELLER);

    // Verify token using seller secret
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER);
      console.log("✅ Decoded Token:", decoded);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    // Ensure decoded payload contains seller ID
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid payload" });
    }

    // Attach seller info to request for downstream use
    req.seller = decoded // thought i got enough but THIS ERROR HMM
   // req.user = decoded; // attaches { id: '...' } directly
   console.log("🚀 ~ file: protect.sellerRoute.js:45 ~ protectSellerRoute ~ req.user:", req.seller)

    next();

  } catch (error) {
    console.error("🚨 Middleware error:", error.message );
    return res.status(500).json({
      message: "Internal Server Error from protectSellerRoute",
      error: error.message
    });
  }
}

export default protectSellerRoute;
