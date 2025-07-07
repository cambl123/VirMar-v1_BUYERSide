import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


async function protectBuyerRoute(req,res,next){
        try {
            const token = req.cookies.token || req.headers.authorization?.split("")[1];

            if(!token){return res.status(401).json({message:"Unauthorized"})}
            
            let decoded ;
            try {
                decoded = await verifyToken(token,process.env.JWT_SECRET_BUYER);

               
            } catch (error) {
                  if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
                console.log(error)
                res.status(403).json({message:"Invalid token"})

            }
             req.user = decoded;
                next();
        }catch (error) {
            console.log(error)
            res.status(500).json({message:"Internal Server Error from protect routes",error:error.message})
            next();//
        }
}

export default protectBuyerRoute