import { config as conf } from "dotenv";
import AWS from "aws-sdk";
conf();

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1", // or your bucket's region
};
// // Create an S3 instance
// const s3 = new AWS.S3();
//Read only
export const config = Object.freeze(_config);
