import { Request, Response, NextFunction } from "express";

async function createBlog(req: Request, res: Response, next: NextFunction) {
    res.json({ msg: "create blog" });
}

export { createBlog };
