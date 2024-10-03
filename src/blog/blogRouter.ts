import express from "express";
import multer from "multer";
// import path from "node:path";
import { createBlogPost } from "./blogController";

const blogRouter = express.Router();

//Routes
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 3e7 }, //3e7 -> 30 MB
});

blogRouter.post("/", upload.single("coverImage"), createBlogPost);

export default blogRouter;
