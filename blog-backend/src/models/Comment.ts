import mongoose from "mongoose"

export interface IComment {
  content: string
  user: mongoose.Types.ObjectId
  post: mongoose.Types.ObjectId
  createdAt: Date
}

const commentSchema = new mongoose.Schema<IComment>({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IComment>("Comment", commentSchema)
