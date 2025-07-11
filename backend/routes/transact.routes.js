// manages all of the wallet operations

import express from "express";
import { createTransaction } from "../controllers/transact.controllers.js";

const transactRoutes = express.Router();

transactRoutes.post("/createtransaction", createTransaction);

export default transactRoutes;
