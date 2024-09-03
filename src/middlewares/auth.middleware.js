import jwt from"jsonwebtoken";
import { User } from "../models/user.model.js"
export const verifyJWT = async (req,res,next) =>{

    try{
        const token = req.cookies.token 

        if(!token){
            return res.status(401).json({
                message:"Unauthorized token",
                success :false
            })
        }
        const decodedToken = await jwt.verify(token,process.env.SECRET_KEY)

        if(!decodedToken){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decodedToken.userId;
        next();
    }
    catch (error){
        console.log(error)
    }
}