import express from "express";
import { createBlogPost } from "./blogController";
import multer from "multer";
import path from "node:path";

const blogRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 3e7 }, //3e7 -> 30 MB
});
//routes
blogRouter.post("/", upload.single("coverImage"), createBlogPost);

export default blogRouter;
