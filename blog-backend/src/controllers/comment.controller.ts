import { Request, Response } from "express"
import mongoose from "mongoose"
import Comment from "../models/Comment"
import Post from "../models/Post"

export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const user = (req as any).user
    const postId = req.params.id

    if (!content) {
      return res.status(400).json({ error: "Content required" })
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post id" })
    }

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    const comment = await Comment.create({
      content,
      user: user._id,
      post: postId
    })

    res.status(201).json({
      id: comment._id,
      content: comment.content,
      user: { username: user.username },
      createdAt: comment.createdAt
    })
  } catch {
    res.status(500).json({ error: "Comment failed" })
  }
}

export const getComments = async (req: Request, res: Response) => {
  const postId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: "Invalid post id" })
  }

  const comments = await Comment.find({ post: postId })
    .populate("user", "username")
    .sort({ createdAt: 1 })

  res.json(
    comments.map(c => ({
      id: c._id,
      content: c.content,
      user: { username: (c.user as any).username },
      createdAt: c.createdAt
    }))
  )
}
