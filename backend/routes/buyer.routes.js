import express from 'express'
import { login, logout, register } from '../controllers/seller.controllers.js'
import protectBuyerRoute from '../configs/middleware/potect.buyerRoute.js'

const BuyerRoutes = express.Router()


BuyerRoutes.post('/register',register)
BuyerRoutes.post('/login',login)
BuyerRoutes.get('/logout', logout)
BuyerRoutes.get('/profile', protectBuyerRoute, getUserProfile)


export default BuyerRoutes