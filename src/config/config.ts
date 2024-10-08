import { config as conf } from "dotenv";
conf();

const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    googleKey: process.env.GOOGLE_API_KEY,
    frontendDomain: process.env.FRONTEND_DOMAIN,
};

//Read only
export const config = Object.freeze(_config);
