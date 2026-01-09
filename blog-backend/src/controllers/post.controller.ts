import { Request, Response } from "express"
import Post from "../models/Post"
import mongoose from "mongoose"

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body
    const user = (req as any).user

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content required" })
    }

    const post = await Post.create({
      title,
      content,
      author: user._id
    })

    res.status(201).json({
      id: post._id,
      title: post.title,
      content: post.content,
      author: {
        id: user._id,
        username: user.username
      },
      createdAt: post.createdAt
    })
  } catch {
    res.status(500).json({ error: "Post creation failed" })
  }
}

export const getPosts = async (_: Request, res: Response) => {
  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 })

  res.json(
    posts.map(p => ({
      id: p._id,
      title: p.title,
      author: { username: (p.author as any).username },
      createdAt: p.createdAt
    }))
  )
}

export const getPost = async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post id" })
  }

  const post = await Post.findById(req.params.id).populate("author", "username")

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  res.json({
    id: post._id,
    title: post.title,
    content: post.content,
    author: { username: (post.author as any).username },
    createdAt: post.createdAt
  })
}

export const deletePost = async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid post id" })
  }

  const user = (req as any).user
  const post = await Post.findById(req.params.id)

  if (!post) {
    return res.status(404).json({ error: "Post not found" })
  }

  if (post.author.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "Not allowed" })
  }

  await post.deleteOne()
  res.json({ message: "Post deleted" })
}
