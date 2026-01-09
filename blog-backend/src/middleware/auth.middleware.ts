import {Request,Response,NextFunction} from "express"
import {verifyToken} from "../utils/jwt"
import User from "../models/User"

export const authMiddleware=async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        
        const header = req.headers.authorization
        console.log("Auth header:", header)

        if(!header || !header.startsWith("Bearer")){
            return res.status(401).json({error:"Not authorized"})
        }
        const token=header.split(" ")[1]
        const decoded=verifyToken(token)

        const user=await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({error:"User not found"})
        }
        (req as any).user=user
        next()
    } catch (error) {
        res.status(401).json({ error: "Invalid token" })
    }
}