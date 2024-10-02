import express from "express";
import { createBlog } from "./blogController";

const blogRouter = express.Router();

//routes
blogRouter.post("/", createBlog);

export default blogRouter;
