import { User } from "../user/userTypes";

export interface BlogPost {
    _id: string;
    title: string;
    content: string;
    blogger: User;
    category: string;
    coverImage: string;
    comments: [
        {
            userId: string;
            content: string;
            createdAt: Date;
        }
    ];
    createdAt: Date;
    updatedAt: Date;
}
