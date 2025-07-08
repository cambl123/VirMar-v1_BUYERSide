import express from 'express'
import protectBuyerRoute from '../configs/middleware/potect.buyerRoute.js'
import { addItemToCart, getUserProfile, login, logout, register } from '../controllers/buyer.controllers.js'

const BuyerRoutes = express.Router()


BuyerRoutes.post('/register',register)
BuyerRoutes.post('/login',login)
BuyerRoutes.get('/logout', logout)
BuyerRoutes.get('/profile', protectBuyerRoute, getUserProfile)


// cart and buying activities
BuyerRoutes.post('/cart/:cartId/item', protectBuyerRoute, addItemToCart)
BuyerRoutes.get('/cart')


export default BuyerRoutes