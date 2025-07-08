import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellersSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    fullname: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, unique: true, trim: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['seller', 'admin'], default: 'seller' },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    paymentMethods: [{ type: String, enum: ['cash', 'credit_card', 'mobile_money', 'bank_transfer'], default: 'cash' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet'}
     },
     {timestamps: true});


sellersSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            console.log('password is hashed')
            next();
    } catch (err) {
    next(err);
    console.log(`error in handling pre save ${err}`)
  }
    }

});




const Seller = mongoose.model('Seller', sellersSchema);
export default Seller;