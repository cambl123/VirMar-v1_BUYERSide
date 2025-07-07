// i want to start fresh
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../configs/token.config.buyer.js"
import Buyer from "../models/buyer.model.js"
import Wallet from "../models/wallet.schema.js"

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

        generateTokenAndSetCookie;

        const buyerWithoutPassword = buyer.toObject()
        delete buyerWithoutPassword.password

        res.status(200).json({message:'successfully logged in' , buyer: buyerWithoutPassword})


    } catch (error) {
        console.log(`erro logging in ${error}`)
        res.status(500).json({meesage: 'error loging in'})
    }
}

export const logout = async (req,res)=>{
    req.clearCookie('token')

    res.status(200).json({message: 'successfully logged out'})
}

export const getUserProfile = async (req,res)=>{
    const userid = req.user.id
    try {
        if(!userid){return res.status(404).json({message: 'not authorized'})}
    } catch (error) {
        console.log(`error getting profile ${error}`)
    }
}