import { Request, Response, NextFunction } from "express";

async function createUser(req: Request, res: Response, next: NextFunction) {
    res.status(201).json({ message: "user created" });
}

export { createUser };
