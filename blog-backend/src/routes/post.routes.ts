import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import {
  createPost,
  getPosts,
  getPost,
  deletePost
} from "../controllers/post.controller"
import { addComment, getComments } from "../controllers/comment.controller"


const router = Router()

router.post("/", authMiddleware, createPost)
router.get("/", getPosts)
router.get("/:id", getPost)
router.delete("/:id", authMiddleware, deletePost)
router.post("/:id/comments", authMiddleware, addComment)
router.get("/:id/comments", getComments)


export default router
