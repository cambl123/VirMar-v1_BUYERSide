import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fullname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['seller', 'admin'],
        default: 'seller'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    paymentMethods: [{
        type: String,
        enum: ['cash', 'credit_card', 'mobile_money', 'bank_transfer'],
        default: 'cash'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    }
},{timestamps: true});
// You can use bcrypt or any other hashing library for this purpose.
// sellerSCHEMA Above here i did not select it

sellersSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
    } catch (err) {
    next(err);
  }
    }

    
    //next();
// The `next` function is a callback that you call to indicate that the middleware has completed its work. In this case, it allows the save operation to proceed after hashing the password. If you don't call `next`, the save operation will hang indefinitely.

});

// const Seller = mongoose.model('Seller', sellersSchema);
//what's with this next function?
const Seller = mongoose.model('Seller', sellersSchema);


export default Seller;