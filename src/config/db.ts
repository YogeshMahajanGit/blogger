import mongoose from "mongoose";
import { config } from "./config";

async function connectDB() {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to database successfully");
        });

        mongoose.connection.on("error", (error) => {
            console.log("Error in connecting to databse.", error);
        });

        await mongoose.connect(config.databaseUrl as string);
    } catch (error) {
        console.error("Faild to connect database..", error);
        process.exit(1);
    }
}

export default connectDB;
