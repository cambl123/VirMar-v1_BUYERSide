
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './configs/mongo.connect.js'

import sellerRoutes from './routes/seller.routes.js'
import BuyerRoutes from './routes/buyer.routes.js'
import protectBuyerRoute from './configs/middleware/potect.buyerRoute.js'
import Seller from './models/sellers.model.js'
//import transactRoutes from './routes/transact.routes.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
//express middlewares for parsing json data format
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })) //if you want to parse urlencoded data
app.use(express.json())
app.use(cors())


//the main endpoint API

app.use('/api/seller',sellerRoutes)

app.use('/api/buyer',BuyerRoutes)

//app.use('/api/transact',transactRoutes)
app.get('/',async (req,res)=>{
    //get suggest sellers for a buyer
    try {
    const info = await Seller.find({isActive: true})
    if(!info){return res.status(404).json({message: 'no sellers'})}
    const randomSellers = info.sort(() => 0.5 - Math.random()).slice(0, 5);
    randomSellers.forEach(seller => {
        seller.password = null
    })
    
    res.json({sellers: randomSellers})

        
    } catch (error) {
        res.json({message: error.message})
    }


})




connectDB()//connect to the database
//this is the main entry point of the application
app.listen(PORT,()=>{
    //connectDB
    //connectDB(); this caused the error at this place
    console.log(`server is running at http://localhost:${PORT}`)
    
})

