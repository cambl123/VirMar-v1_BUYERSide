import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
/**
 * this is public protect routes the one v0 told me to use
 */

dotenv.config();

async function protectRoutes(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Unauthorized: No token provided' });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_BUYER);
    } catch (errBuyer) {
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER);
      } catch (errSeller) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    const { role, id } = decoded;
    req.user = { role, id };
    // attach for downstream use
    console.log('Decoded payload:', decoded);
    console.log('req.user being set:', { role, id });

    next();

  } catch (error) {
    console.error('Error protecting routes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default protectRoutes
