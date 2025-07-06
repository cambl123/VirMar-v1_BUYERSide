import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()


const connectDB = async ()=> {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn}`)
        //mongoose.set('strictQuery', false) // to avoid deprecation warning
        console.log(`mongo connected`)

    } catch (error) {
        console.log(error)
        process.exit(1)

    }
    
}

export default connectDB