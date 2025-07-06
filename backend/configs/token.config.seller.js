import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const giveTokenAndCookieForSeller = (res, seller) => {
    // Generate a JWT token
    const token = jwt.sign(
        { id: seller._id, role: seller.role },
        process.env.JWT_SECRET_SELLER, // Use a different secret for sellers
        { expiresIn: '1d' }
    );

    // Set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

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
}
//CAN I USE THIS FOR BUYER AS WELL?
// Yes, you can use a similar function for buyers, just ensure to use a different secret
//HOW CAN I USE THIS RETURNED OBJECT TO SEND A RESPONSE?
// You can use it in your controller like this:
//WITH THIS CODE THE TOKEN VARIABLE KEEPS COOKIE?
// Then send the response

//HOW ABOUT THE TOKEN AND THE COOKIE?
// The token is set in the cookie automatically by the `res.cookie` method, and you can also return it in the response body if needed. The cookie will be sent with subsequent requests, allowing you to authenticate the seller on those requests.
//DO I NEED TO SET THE COOKIE IN THE RESPONSE?
// No, you don't need to set the cookie manually in the response. The `res.cookie` method takes care of that for you.
//HOW CAN I DECODE THE TOKEN TO PROTECT ROUTES?
// You can create a middleware function that checks the token in the request headers or cookies, verifies it, and decodes the user information. Here's a simple example:    

// IS THE TOKEN PROVIDED ONCE IN THE LIFE TIME OF THE USER?
// Yes, the token is typically issued once when the user logs in or registers. It can be refreshed or renewed as needed, but the same token is used for subsequent requests until it expires or the user logs out.
//AND WHEN IT EXPIRES?
// When the token expires, the user will need to log in again to receive a new token. You can also implement a refresh token mechanism to allow users to obtain a new token without logging in again, but that requires additional logic and security considerations.
//AND YOU MEAN THAT I WILL CALL THIS FUNCTION AGAIN IN THE LOGIN CONTROLLER?
// Yes, you would call the `giveTokenAndCookieForSeller` function again in your login controller to generate a new token and set the cookie when the user logs in successfully. This ensures that the user receives a fresh token each time they log in, which is important for security and session management.
//WOULDN'T YOU PUT TRY CATCH BLOCKS IN THE FUNCTION AUTHMIDDLEWARE?
// Yes, it's a good practice to wrap the logic in the `authMiddleware` function in a try-catch block to handle any potential errors gracefully. Here's an updated version of the middleware with error handling:

//MAKE IT A LITTLE BIT MORE DETAILED AND UNIQUE
// This middleware checks for the token in both cookies and headers, verifies it, and attaches the decoded user information to the request object.
// If any error occurs during the process, it catches the error and sends a 500 Internal Server Error response with the error message.
// You can then use this middleware in your routes to protect them, like so:
