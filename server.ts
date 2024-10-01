import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";

async function startServer() {
    await connectDB();
    const port = config.port || 8000;

    app.listen(port, () => {
        console.log(`Server start at ${port} 🚀`);
    });
}

startServer();
