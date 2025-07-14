import express, { Request, Response } from "express";
import categoryRoutes from "./category";
import productRoutes from "./product";
import carrierRoutes from "./carrier";

const apiV1Routes = express.Router()

apiV1Routes.get("/", (request: Request, response: Response) => {
    response.json({ "status": "works" });
})

apiV1Routes.use("/categories", categoryRoutes)
apiV1Routes.use("/products", productRoutes)
apiV1Routes.use("/carriers", carrierRoutes)


export default apiV1Routes;
