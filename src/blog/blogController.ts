import { Request, Response, NextFunction } from "express";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { config } from "../config/config";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import BlogPost from "./blogModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize S3 client
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
    // const sleep = await new Promise((resolve) => setTimeout(resolve, 7000));
    try {
        const list = await BlogPost.find({})
            .populate("blogger", "name")
            .sort({ createdAt: -1 });

        res.json(list);
    } catch (err) {
        return next(createHttpError(500, "Erorr while getting a blog"));
    }
}

async function listUserOnlyBlog(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    //Get userId
    const userId = req.params.userId;

    try {
        const blogs = await BlogPost.find({ blogger: userId })
            .populate("blogger", "name")
            .sort({
                createdAt: -1,
            });

        if (!blogs.length) {
            res.status(404).json({ message: "You don't have any blogs" });
            return;
        }

        res.status(200).json(blogs);
    } catch (error) {
        return next(createHttpError(500, "Server error while fetching blogs"));
    }
}

async function getSingleBlog(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    try {
        const blog = await BlogPost.findOne({ _id: id }).populate(
            "blogger",
            "name"
        );

        if (!blog) {
            return next(createHttpError(404, "Post not found"));
        }

        res.json(blog);
    } catch (error) {
        return next(createHttpError(500, "Error while getting blog"));
    }
}

async function deleteBlog(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const id = req.params.id;

    const blogPost = await BlogPost.findOne({ _id: id });
    if (!blogPost) {
        return next(createHttpError(404, "Post not found"));
    }

    //Check access
    const _req = req as AuthRequest;
    if (blogPost.blogger.toString() !== _req.userId) {
        return next(createHttpError(403, "You can not delete."));
    }

    // Delete the  image from S3
    try {
        const deleteFromS3 = async (key: string) => {
            const params = {
                Bucket: "my-blogger-images",
                Key: key,
            };
            const command = new DeleteObjectCommand(params);
            return s3.send(command);
        };
        //get key
        const imageKey = blogPost.coverImage.split("/").pop();

        await deleteFromS3(imageKey as string);

        //delete blog from DB
        await BlogPost.deleteOne({ _id: id });
    } catch (error) {
        next(createHttpError(500, "Error while delete blog"));
    }

    res.sendStatus(204);
    return;
}

async function generateBlog(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { prompt } = req.body;
    const key = config.googleKey;

    const genAI = new GoogleGenerativeAI(key as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!prompt) {
        res.status(400).json({ message: "Prompt is required" });
        return;
    }

    //generating blog
    try {
        const result = await model.generateContent(prompt);
        const generatedContent = result.response.text();
        res.status(200).json({ content: generatedContent });
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, "Error generating content"));
    }
}

export {
    createBlogPost,
    updateBlogPost,
    listAllBlogs,
    getSingleBlog,
    deleteBlog,
    generateBlog,
    listUserOnlyBlog,
};
