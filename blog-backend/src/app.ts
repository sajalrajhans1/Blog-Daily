import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes"
import postRoutes from "./routes/post.routes"



const app=express();

app.use(cors());
app.use(express.json())
dotenv.config();
connectDB();

app.use("/auth",authRoutes)
app.use("/posts", postRoutes)


export default app;
