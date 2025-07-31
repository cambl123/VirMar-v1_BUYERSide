// manages all of the wallet operations

import express from "express";
import { createTransaction } from "../controllers/transact.controllers.js";
import { cancelOrder } from "../controllers/order.controllers.js";
import protectBuyerRoute from "../configs/middleware/potect.buyerRoute.js";
import protectRoutes from "../configs/middleware/protectRoutes.js";
import { depositFunds } from "../controllers/transact.controllers.js";


const transactRoutes = express.Router();

transactRoutes.post("/createtransaction", createTransaction) ;
transactRoutes.post('/cancel/:orderId',protectRoutes, cancelOrder)
transactRoutes.post("/deposit",protectRoutes,depositFunds);
transactRoutes.get('/transactions',protectRoutes,async (req,res)=>{
    // still in development
    const {role,user} = req.user;
    

    try {
            if(user === 'seller'){
                return res.status(404).json({message:'not allowed to make the transaction'})
            }
            res.status(200).json({user})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
})

export default transactRoutes;
