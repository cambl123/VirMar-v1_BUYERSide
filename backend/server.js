//importing the required modules
//this is the main entry point of the application
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './configs/mongo.connect.js'

import sellerRoutes from './routes/seller.routes.js'
import getallrouter from './routes/user.routes.js'
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
//express middlewares for parsing json data format
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })) //if you want to parse urlencoded data
app.use(express.json())
app.use(cors())


//the main endpoint API
app.use('/',getallrouter)//this will get random info for frontend to set {it is not protected}

app.use('/api/seller',sellerRoutes)//not protected too
//app.use('/api/seller',login) my second best bug in the world

app.post('/api/data', (req, res) => {
  console.log('Request received:', req.body);
  try {
    // your processing logic
    res.status(200).json({ message: 'Success!' });
  } catch (err) {
    console.error('Error in route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//the port we are going to listen
connectDB()//connect to the database
//this is the main entry point of the application
app.listen(PORT,()=>{
    //connectDB
    //connectDB(); this caused the error at this place
    console.log(`server is running at http://localhost:${PORT}`)
    
})

