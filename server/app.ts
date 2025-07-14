import express, { Request, Response } from "express";
import apiV1Routes from "./routes/apiV1";
var bodyParser = require('body-parser');


//Create istance of express app
const app = express();

//Configure to use json body
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

//Configure api routes
app.use("/api/v1", apiV1Routes)

//Redirect the default index to /api/v1
app.get("/", (request: Request, response: Response) => {
    response.redirect("/api/v1")
});

//Serve assets folder as public
app.use("/assets", express.static("assets"))


export default app;
