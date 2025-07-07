import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()


const connectDB = async ()=> {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected`)
        

    } catch (error) {
        console.log(`error while connecting db ${error}`)
        process.exit(1)

    }
    
}

export default connectDB