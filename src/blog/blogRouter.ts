import express from "express";
import { createBlogPost } from "./blogController";

const blogRouter = express.Router();

//routes
blogRouter.post("/", createBlogPost);

export default blogRouter;
