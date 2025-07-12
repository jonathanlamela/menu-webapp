import express, { Request, Response } from "express";
import dotenv from "dotenv";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/api/v1", (request: Request, response: Response) => {
    response.status(200).send({
        "status": "api works",
    });
});

app.get("/", (request: Request, response: Response) => {
    response.redirect("/api/v1")
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
