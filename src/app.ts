import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import blogRouter from "./blog/blogRouter";

const app = express();
app.use(express.json());

//Routes
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

//Global error handler
app.use(globalErrorHandler);

export default app;
