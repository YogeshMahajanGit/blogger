import app from "./src/app";

function startServer() {
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
        console.log(`Server start at ${port}`);
    });
}

startServer();
