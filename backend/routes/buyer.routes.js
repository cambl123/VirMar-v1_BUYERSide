import express from 'express'
import { login, signin } from '../controllers/buyer.controllers.js';
import { register, getProfile, logout } from '../controllers/buyer.controllers.js';
import { getOrders, createOrder } from '../controllers/order.controllers.js';
import { getCart, addToCart, removeFromCart } from '../controllers/cart.controllers.js';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controllers.js';
import { searchItems } from '../controllers/search.controllers.js';
import { getLikes, addLike, removeLike } from '../controllers/like.controllers.js';
// Importing the buyer model to use in the routes

import buyer from '../models/buyer.model.js';

const buyerRoutes = express.Router();
//example route to test the API
buyerRoutes.get('/',(req, res) => {
    res.json('Welcome to the buyer API');
    buyerRoutes.post('/example', async function(req, res) {
        const data =await req.body;
        console.log("Received data:", data);
        res.json({ message: 'Data received successfully', data });
    }   )
});

//authentication and authorization
buyerRoutes.post('/signin',signin);
buyerRoutes.post('/login', login);
buyerRoutes.post('/register', register);
buyerRoutes.get('/profile', getProfile);
buyerRoutes.post('/logout', logout);
buyerRoutes.get('/orders', getOrders);
buyerRoutes.post('/orders', createOrder);
//cart
buyerRoutes.get('/cart', getCart);
buyerRoutes.post('/cart', addToCart);
buyerRoutes.delete('/cart/:itemId', removeFromCart);
//wishlist
buyerRoutes.get('/wishlist', getWishlist);
buyerRoutes.post('/wishlist', addToWishlist);
buyerRoutes.delete('/wishlist/:itemId', removeFromWishlist);
buyerRoutes.get('/search', searchItems);

buyerRoutes.get('/likes', getLikes);
buyerRoutes.post('/likes', addLike);
buyerRoutes.delete('/likes/:itemId', removeLike);

export default buyerRoutes;
// gethrhryh