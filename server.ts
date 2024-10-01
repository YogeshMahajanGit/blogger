import app from "./src/app";
import { config } from "./src/config/config";

function startServer() {
    const port = config.port || 8000;

    app.listen(port, () => {
        console.log(`Server start at ${port} 🚀`);
    });
}

startServer();
