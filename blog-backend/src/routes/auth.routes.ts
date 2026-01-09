import {Router} from "express"
import { register,login } from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router=Router()

router.post("/register",register)
router.post("/login",login)

router.get("/me",authMiddleware,(req,res)=>{
    const user=(req as any).user
    res.json({
        id:user._id,
        username:user.username,
        email:user.email
    })
})
export default router