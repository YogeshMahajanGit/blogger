import { Request, Response, NextFunction } from "express";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "../config/config";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import BlogPost from "./blogModel";
import { json } from "stream/consumers";
import { createDeflate } from "zlib";

// Initialize S3 client
// put in helper function
const s3 = new S3({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId!,
        secretAccessKey: config.secretAccessKey!,
    },
});

async function handleUploadImageToAWS(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
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
        // Upload the image to AWS S3
        const key = await uploadToS3(req.file);
        // Construct the image URL
        const imageUrl = `https://my-blogger-images.s3.${config.region}.amazonaws.com/${key}`;

        return imageUrl;
    } catch (error) {
        return next(createHttpError(500, "Error during image upload process"));
    }
}

async function createBlogPost(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { title, content, category, comments } = req.body;

    try {
        const imageUrl = await handleUploadImageToAWS(req, res, next);

        if (!imageUrl) {
            return next(createHttpError(400, "No image provide"));
        }

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

async function updateBlogPost(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { title, content, category } = req.body;
    const id = req.params.id;

    // Check if post is present
    const blogPost = await BlogPost.findOne({ _id: id });

    if (!blogPost) {
        next(createHttpError(404, "Post not found"));
        return;
    }

    //Check access
    const _req = req as AuthRequest;
    if (blogPost.blogger.toString() !== _req.userId) {
        return next(createHttpError(403, "You can not update."));
    }

    let updateCoverImage = "";
    if (req?.file) {
        //Delete the old image from S3
        const deleteFromS3 = async (key: string) => {
            const params = {
                Bucket: "my-blogger-images",
                Key: key,
            };

            const command = new DeleteObjectCommand(params);
            return s3.send(command);
        };
        //get key (oldImageKey)
        const oldImageKey = blogPost.coverImage.split("/").pop();

        await deleteFromS3(oldImageKey as string);

        //update new image
        updateCoverImage = (await handleUploadImageToAWS(
            req,
            res,
            next
        )) as string;
    }
    //Update Blog Post
    const updateBlogPost = await BlogPost.findOneAndUpdate(
        {
            _id: id,
        },
        {
            title,
            content,
            category,
            coverImage: updateCoverImage
                ? updateCoverImage
                : blogPost.coverImage,
        },
        {
            new: true,
        }
    );
    res.json({ "update post: ": updateBlogPost });
}

async function listAllBlogs(req: Request, res: Response, next: NextFunction) {
    try {
        const list = await BlogPost.find(req.query).sort({ createdAt: -1 });

        // add pagination
        // let page = Number(req.query.page) || 1;
        // let limit = Number(req.query.limit) || 2;

        // let skip = (page - 1) * limit;

        // // list = list.skip(skip);

        res.json({ list, length: list.length });
    } catch (err) {
        return next(createHttpError(500, "Erorr while getting a blog"));
    }
}

export { createBlogPost, updateBlogPost, listAllBlogs };
