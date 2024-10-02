import { Request, Response, NextFunction } from "express";
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

async function createBlogPost(req: Request, res: Response, next: NextFunction) {
    const { title, content, category } = req.body;
    console.log(title, content, category);
    res.json({ msg: "create blog" });
}

export { createBlogPost };
