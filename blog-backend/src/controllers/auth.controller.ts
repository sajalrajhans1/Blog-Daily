import {Request,Response} from "express"
import User from "../models/User"
import {hashPassword,comparePassword} from "../utils/hash"
import { signToken } from "../utils/jwt"

export const register=async (req:Request,res:Response)=>{
    try {
        const {username,email,password}=req.body

        if(!username || !email || !password){
            return res.status(400).json({error:"All fields are required "})
        }
        const existing=await User.findOne({email})

        if(existing){
            return res.status(400).json({error:"Email already in use"})
        }
        const hashed=await hashPassword(password)
        const user=await User.create({
            username,
            email,
            password:hashed
        })
        const token=signToken(user._id.toString())

        res.status(201).json({
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            },
            token
        })
    } catch (error) {
        res.status(500).json({error:"Registration failed"})
    }
}
export const login=async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Invalid credentials"})
        }
        const isMatch=await comparePassword(password,user.password)
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"})
        }
        const token=signToken(user._id.toString())

        res.json({
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            },
            token
        })
    } catch (error) {
        res.status(500).json({error:"Login Failed"})
    }
}


