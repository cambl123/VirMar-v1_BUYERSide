import express from "express";
import { releaseEscrow, getEscrowStatus } from "../controllers/escrow.controllers.js";
import protectBuyerRoute from "../configs/middleware/potect.buyerRoute.js";

const router = express.Router();

// POST: /api/escrow/release/:orderId
router.post("/release/:orderId", protectBuyerRoute, releaseEscrow);

// GET: /api/escrow/status/:orderId
router.get("/status/:orderId", protectBuyerRoute, getEscrowStatus);

export default router;
