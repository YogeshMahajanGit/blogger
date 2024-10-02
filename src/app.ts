import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import { createBlog } from "./blog/blogController";

const app = express();
app.use(express.json());

//Routes
app.use("/api/users", userRouter);
app.use("/api/blogs", createBlog);

//Global error handler
app.use(globalErrorHandler);

export default app;
