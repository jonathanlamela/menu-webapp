import express, { Request, Response } from "express";
import dotenv from "dotenv";
import apiV1Routes from "./routes/apiV1";
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

//Configure dotnev to use .env file
dotenv.config();

//Create istance of express app
const app = express();

//Configure to use json body
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

//Retrieve the port from .env
const PORT = process.env.PORT;

//Configure api routes
app.use("/api/v1", apiV1Routes)

//Redirect the default index to /api/v1
app.get("/", (request: Request, response: Response) => {
    response.redirect("/api/v1")
});

//Serve assets folder as public
app.use("/assets", express.static("assets"))

//Start to listen
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on("error", (error) => {

    throw new Error(error.message);
});
