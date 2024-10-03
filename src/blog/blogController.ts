import { Request, Response, NextFunction } from "express";
import { S3, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { config } from "../config/config";

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
    console.log("files : ", req.file);

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
        // Upload the image to S3
        const key = await uploadToS3(req.file);

        // Construct the image URL
        const imageUrl = `https://my-blogger-images.s3.${config.region}.amazonaws.com/${key}`;

        console.log("IMG URL: ", imageUrl);
        res.status(201).json({
            message: "Image uploaded successfully",
            imageUrl: imageUrl,
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        if (error instanceof Error) {
            res.status(500).json({
                error: `Failed to upload image: ${error.message}`,
            });
        } else {
            res.status(500).json({
                error: "Failed to upload image due to an unknown error",
            });
        }
    }
}

export { createBlogPost };
