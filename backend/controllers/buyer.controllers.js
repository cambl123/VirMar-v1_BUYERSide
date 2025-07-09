// i want to start fresh
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../configs/token.config.buyer.js"
import Buyer from "../models/buyer.model.js"
import Wallet from "../models/wallet.schema.js"
import Item from "../models/items.model.js"
import { generateNotification } from "../utils/notification.maker.js"
import { sendEmailNotification } from "../utils/email.notification.js"

export const register = async (req,res) => {
    console.log('register')
    const {email ,name ,password ,phone} = req.body
    try {
        if(!email || !name || !password ){return res.status(404).json({message:"missing fields"})}
        const emailExist = await Buyer.findOne({email})
        if(emailExist){return res.status(404).json({message:"existing email"})}
        const nameExist = await Buyer.findOne({name})
        if(nameExist){return res.status(404).json({message:"existing username"})}
        const newBuyer = new Buyer({
            name:name,
            password:password,
            email:email,
            phone:phone
        })
        if(newBuyer){
            //create a wallet
            const newWallet = new Wallet({
                balance:0,
                buyer_id:newBuyer._id
            })
            await newWallet.save()
            newBuyer.wallet_id = newWallet._id
            generateTokenAndSetCookie(res,newBuyer)
        }
            
        await newBuyer.save()
        const buyerNoPassword = newBuyer.toObject()
        delete buyerNoPassword.password
        // generateNotification('welcome',`welcome ${buyerNoPassword.name}`,buyerNoPassword._id,Buyer)
        sendEmailNotification(generateNotification('welcome',`welcome ${buyerNoPassword.name}`,buyerNoPassword._id,'Buyer'))
        console.log('sent email notification')
        res.status(200).json({message:"successfuly registered",buyer:buyerNoPassword })   
        
    } catch (error) {
        console.log('error in register'+error)
        res.status(500).json({message:error})
    }
    
}

export const login = async (req,res)=>{
    const { email, password, name} = req.body

    try {
        //validate emails
        const buyer = await Buyer.findOne({email})

        if(!buyer){return res.status(403).json({message: 'no user please register'})}

        //check if the password is matched
        const isvalidPassword = await bcrypt.compare(password, buyer.password)
        if(!isvalidPassword){return res.status(403).json({message: 'invalid credentials'})}

        generateTokenAndSetCookie(res,buyer);

        const buyerWithoutPassword = buyer.toObject()
        delete buyerWithoutPassword.password

        generateNotification('welcome back',`welcome back ${buyerWithoutPassword.name}`,buyerWithoutPassword._id,'Buyer')
        
        sendEmailNotification(generateNotification('you are logged in','succesfully logged into virmar account', buyerWithoutPassword.email))
        console.log(`sent email notification`)


        res.status(200).json({message:'successfully logged in' , buyer: buyerWithoutPassword})


    } catch (error) {
        console.log(`erro logging in ${error}`)
        res.status(500).json({meesage: 'error loging in'})
    }
}

export const logout = async (req,res)=>{
    try {
    res.clearCookie('token'); // Clear the cookie from the browser

    res.status(200).json({message: 'successfully logged out'})
        
    } catch (error) {
        console.log(`error logging out ${error}`)
        res.status(500).json({message: 'error logging out'})
        
    }
    
}

export const getUserProfile = async (req,res)=>{
    const userid = req.user.id
    try {
        if(!userid){return res.status(404).json({message: 'not authorized'})}
        const buyer = await Buyer.findById(userid)
        res.status(200).json({message: 'successfully got profile',buyer:buyer})

    } catch (error) {
        console.log(`error getting profile ${error}`)
        res.status(500).json({message:'error getting profile'})
    }
}


//cart activities

export const addItemToCart = async (req,res)=>{
    const {product_id , quantity} = req.body
    try {
        const userid = req.user.id
        if(!userid){return res.status(404).json({message: 'not authorized'})}
        const buyer = await Buyer.findById(userid)
        //updating the item status to reserved
        //update the quantity
        
        await Item.findByIdAndUpdate(product_id, {status:'reserved', quantity:quantity})
        console
        buyer.cart.push(product_id)
        await buyer.save()
        res.status(200).json({message: 'successfully added item to cart'})
        
    } catch (error) {     
        console.log(`error adding item to cart ${error}`)
        res.statue(500).json({message:'error adding item to cart'})

        
    
    }
}
