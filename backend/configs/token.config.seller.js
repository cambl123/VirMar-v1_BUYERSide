import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const giveTokenAndCookieForSeller = (res, seller) => {
    // Generate a JWT token
    const token = jwt.sign(
        { id: seller._id },
        process.env.JWT_SECRET_SELLER, // Use a different secret for sellers
        { expiresIn: '1d' }
    );
    console.log("🚀 ~ file: token.config.seller.js:9 ~ giveTokenAndCookieForSeller ~ token:", token)

    // Set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    console.log("🚀 ~ file: token.config.seller.js:13 ~ giveTokenAndCookieForSeller ~ res.cookie:", res.cookie)

    // Return the token and seller info (excluding password)
    return {
        token,
        seller: {
            _id: seller._id,
            name: seller.name,
            email: seller.email,
            role: seller.role,
            isActive: seller.isActive,
            isVerified: seller.isVerified
        }
    };
    console.log("🚀 ~ file: token.config.seller.js:19 ~ giveTokenAndCookieForSeller ~ return:")
}

