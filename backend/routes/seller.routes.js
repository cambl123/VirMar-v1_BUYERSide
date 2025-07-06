import express from 'express'
import { addItemToStore, getUserProfile, login, logout, register } from '../controllers/seller.controllers.js'
import protectRoute from '../configs/middleware/protect.sellerRoute.js'
import { get } from 'mongoose'
import protectSellerRoute from '../configs/middleware/protect.sellerRoute.js'

const sellerRoutes = express.Router()

sellerRoutes.post('/test',(req, res) => {
    console.log(req.body)
    res.status(501).json({ message: "Login route not implemented yet", data: req.body })
})
//sellerRoutes.post('/getUserProfile',protectRoute(req,res,next),login)
sellerRoutes.post('/register',register)
sellerRoutes.post('/login',login)
sellerRoutes.get('/logout', logout)
sellerRoutes.get('/profile', protectSellerRoute, getUserProfile) // Assuming you have a getUserProfile controller

//inventory creation like store and items

//sellerRoutes.get('/store', protectSellerRoute, getItems) 
sellerRoutes.post('/store/:storeId/item', protectSellerRoute, addItemToStore) 


export default sellerRoutes