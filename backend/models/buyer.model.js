import mongoose from 'mongoose'
import geolocation from './location.js'

const buyerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    /*transaction: {
        type: mongoose.Schema.types.ObjectId,
        // this is a reference to the transaction model
        // this is used to populate the transaction field in the buyer model
        // when we query the buyer model, we can populate the transaction field with the transaction data

        ref: Transaction,
        default: [],
    },*/
    location: geolocation,
    phone: {
        type: String,
  
        minLength: 10,
        maxLength: 15
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    }
    

},{timestamps: true})

// password hashing or encrypting 

buyerSchema.pre('save',async function (next){
    if(this.isModified('password')){
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
    }
    next()
    //what if it is not modified
})

buyerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)

}

//password compare
//so i do not have to use bcrypt.compare in the controller

const buyer = mongoose.model('buyer', buyerSchema)


export default buyer