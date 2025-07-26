import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Buyer from '../models/buyer.model.js';
dotenv.config();

async function generateTokenAndSetCookie (res, Buyer) {
    const token = jwt.sign({id: Buyer._id, role:"buyer"},process.env.JWT_SECRET_BUYER,{expiresIn: '1d'});
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000
    });
    return {
        token,
        buyer: {
            _id: Buyer._id,
            name: Buyer.name,
            email: Buyer.email,
            role: Buyer.role,
            isActive: Buyer.isActive,
            isVerified: Buyer.isVerified
        }
    };
}
export default generateTokenAndSetCookie
// token configuration
