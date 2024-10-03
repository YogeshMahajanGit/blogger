import { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId: string;
}

function authenticate(req: Request, res: Response, next: NextFunction) {
    //Get token
    const token = req.header("Authorization");
    if (!token) {
        return next(createHttpError(401, "Authorization is NOT Valid"));
    }

    //Token verification
    try {
        const parsedToken = token.split(" ")[1];
        const decoded = verify(parsedToken, config.jwtSecret as string);
        const _req = req as AuthRequest;
        _req.userId = decoded.sub as string;
    } catch (error) {
        return next(createHttpError("401", "Token not verify"));
    }
    next();
}

export default authenticate;
