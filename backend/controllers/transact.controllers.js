import createNotification from "../utils/notification.maker";


export const createTransaction = async (req, res) => {
    const {
        item_id,
        buyer_id,
        seller_id,
        quantity,
        totalPrice
    } = req.body;
    
    try {
        const transaction = await Transaction.create({
            item_id,
            buyer_id,
            seller_id,
            quantity,
            totalPrice
        })
        if(transaction){
            //send notification
            try {
                createNotification({
                    title: "New Transaction",
                    message: "A new transaction has been requested",
                    recipientId: seller_id,
                    recipientModel: "Seller"
                })
               
                
            } catch (error) {
                console.log(`error while sending notification ${error}`);
                res.status(500).json({ message: "Internal Server Error" });
            }
            res.status(201).json({ message: "Transaction created successfully" });
        }
        
    } catch (error) {
        console.log(`error while creating transaction ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }

}