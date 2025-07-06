import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
   // location: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
         // Assuming you have a Seller model
            required: true
            },

        },{timestamps: true});
const Store = mongoose.model("Store", storeSchema);
export default Store;