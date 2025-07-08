import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const buyerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
   // transaction:[ { type: mongoose.Schema.types.ObjectId, ref: 'Transaction', default: [], }],
    phone: { type: String, minLength: 10, maxLength: 15},
    password: { type: String, minLength: 6, required: true, },
    userWallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
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

// buyerSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password)

// }

//password compare
//so i do not have to use bcrypt.compare in the controller

const Buyer = mongoose.model('Buyer', buyerSchema)


export default Buyer