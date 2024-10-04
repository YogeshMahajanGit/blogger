import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import blogRouter from "./blog/blogRouter";
import { config } from "./config/config";

const app = express();

app.use(
    cors({
        origin: config.frontendDomain,
    })
);
app.use(express.json());

//Routes
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

//Global error handler
app.use(globalErrorHandler);

export default app;
