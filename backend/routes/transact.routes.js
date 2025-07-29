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

export default transactRoutes;
