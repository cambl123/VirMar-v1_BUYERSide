import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Helper to promisify jwt.verify
const verifyToken = (token, secret) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });

const protectSellerRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        let decoded;
        try {
            decoded = await verifyToken(token, process.env.JWT_SECRET_SELLER);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error from protect routes", error: error.message });
    }
};

export default protectSellerRoute;