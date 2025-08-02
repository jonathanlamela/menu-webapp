import express, { Request, Response } from "express";


const routes = express.Router()

routes.get("/status", (request: Request, response: Response) => {
    response.json({ "status": "works" });
})

routes.post("/register", (request: Request, response: Response) => { });

routes.post("/updateUserInfo", (request: Request, response: Response) => { });

routes.post("/updateUserPassword", (request: Request, response: Response) => { });

routes.delete("/delete", (request: Request, response: Response) => { });

export default routes;
