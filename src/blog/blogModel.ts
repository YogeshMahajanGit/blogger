import mongoose from "mongoose";
import { BlogPost } from "./blogTypes";
import { commentSchema } from "./commentModel";

const blogPostSchema = new mongoose.Schema<BlogPost>(
    {
        title: {
            type: String,
            required: [true, "A Blog Post must have a title"],
        },
        content: {
            type: String,
            required: true,
        },
        blogger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        comments: [commentSchema],
    },
    { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
