import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
// import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

async function createUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        //pass error
        return next(error);
    }

    // Database call.
    // try {
    //     const user = await userModel.findOne({ email });
    //     if (user) {
    //         const error = createHttpError(
    //             400,
    //             "User already exists with this email."
    //         );
    //         return next(error);
    //     }
    // } catch (err) {
    //     return next(createHttpError(500, "Error while getting user"));
    // }

    /// password -> bcrypt - hash
    // const hashedPassword = await bcrypt.hash(password, 10);

    // let newUser: User;
    // try {
    //     newUser = await userModel.create({
    //         name,
    //         email,
    //         password: hashedPassword,
    //     });
    // } catch (err) {
    //     return next(createHttpError(500, "Error while creating user."));
    // }

    // try {
    //     // Token generation JWT
    //     const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    //         expiresIn: "7d",
    //         algorithm: "HS256",
    //     });
    //     // Response
    //     res.status(201).json({ accessToken: token });
    // } catch (err) {
    //     return next(createHttpError(500, "Error while signing the jwt token"));
    // }
    res.json({ message: "register succufully" });
}

export { createUser };
