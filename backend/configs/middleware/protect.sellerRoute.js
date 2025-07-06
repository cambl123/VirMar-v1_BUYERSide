import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const protectSellerRoute = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        console.log("Token received:", token); // Debugging line to check the token

        jwt.verify(token, process.env.JWT_SECRET_SELLER, (err, decoded) => {
            if (err) {
                 console.error("JWT verification failed:", err.message);
                    //return res.status(403).json({ message: "Forbidden" });
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired" });
                }

                return res.status(403).json({ message: "Invalid token" });
            }
            console.log("Decoded token:", decoded); // Debugging line to check the decoded token
            // Attach the decoded user information to the request object

            req.user = decoded;
            if (!req.user) {
                return res.status(404).json({ error: "User not found" });
            }
            console.log("Decoded user object:", JSON.stringify(req.user, null, 2));; // Debugging line to check user info
            // Proceed to the next middleware or route handler

            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export default protectSellerRoute