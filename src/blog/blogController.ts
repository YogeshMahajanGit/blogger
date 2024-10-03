import { Request, Response, NextFunction } from "express";
import { S3, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { config } from "../config/config";
import createHttpError from "http-errors";
import BlogPost from "./blogModel";
import { AuthRequest } from "../middlewares/authenticate";

// Initialize S3 client
const s3 = new S3({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
    },
});

async function createBlogPost(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { title, content, blogger, category, comments } = req.body;
    // Check if file is present
    if (!req.file) {
        res.status(400).json({ error: "No image file uploaded" });
        return;
    }
    // Upload Function to S3
    const uploadToS3 = async (file: Express.Multer.File) => {
        const key = `${Date.now()}_${file.originalname}`;
        const params = {
            Bucket: "my-blogger-images",
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return key;
    };

    try {
        // Upload the image to AWS S3
        const key = await uploadToS3(req.file);
        // Construct the image URL
        const imageUrl = `https://my-blogger-images.s3.${config.region}.amazonaws.com/${key}`;

        //Type-cast
        const _req = req as AuthRequest;

        //Create New Blog Post
        const newBlogPost = await BlogPost.create({
            title,
            content,
            category,
            blogger: _req.userId,
            coverImage: imageUrl,
            comments,
        });

        res.status(201).json({
            message: "Post Created Successfully",
            id: newBlogPost._id,
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return next(createHttpError(500, "Error while creating blog"));
    }
}

export { createBlogPost };
