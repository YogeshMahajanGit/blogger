import express from "express";
import multer from "multer";
import { createBlogPost } from "./blogController";
import authenticate from "../middlewares/authenticate";
const blogRouter = express.Router();

//Routes
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 3e7 }, //3e7 -> 30 MB
});

blogRouter.post("/", authenticate, upload.single("coverImage"), createBlogPost);

export default blogRouter;
