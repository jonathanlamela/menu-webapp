import express, { Request, Response } from "express";
import categoryRoutes from "./category";

const apiV1Routes = express.Router()

apiV1Routes.get("/", (request: Request, response: Response) => {
    response.json({ "status": "works" });
})

apiV1Routes.use("/categories", categoryRoutes)


export default apiV1Routes;
