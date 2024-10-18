import express from "express";
import multer from "multer";
import {
    createBlogPost,
    deleteBlog,
    generateBlog,
    getSingleBlog,
    listAllBlogs,
    listUserOnlyBlog,
    updateBlogPost,
} from "./blogController";
import authenticate from "../middlewares/authenticate";
const blogRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 3e7 }, //3e7 -> 30 MB
});

//Routes
blogRouter.post("/", authenticate, upload.single("coverImage"), createBlogPost);

blogRouter.patch(
    "/:id",
    authenticate,
    upload.single("coverImage"),
    updateBlogPost
);

blogRouter.get("/", listAllBlogs);
blogRouter.get("/:id", getSingleBlog);

blogRouter.delete("/:id", authenticate, deleteBlog);

blogRouter.post("/generate-blog", authenticate, generateBlog);

blogRouter.get("/user/:userId", listUserOnlyBlog);

export default blogRouter;
