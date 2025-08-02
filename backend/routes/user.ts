import express, { Request, Response } from "express";
import UserService from "services/user";
import { CreateUserRequest, CreateUserResponse } from "shared/dtos/user";
import { TypedRequest, TypedResponse } from "types";
import logger from "utils/logger";
import { createUserValidator } from "utils/validators/user";
import validateRequest from "utils/validators/validateRequest";


const router = express.Router()

router.get("/status", (_: Request, response: Response) => {
    response.json({ "status": "works" });
})

router.post("/register", validateRequest(createUserValidator), async (
    request: TypedRequest<{}, CreateUserRequest, {}>,
    response: TypedResponse<CreateUserResponse>) => {
    try {
        const serviceResponse = await new UserService()
            .create(request.body);
        response.status(201).json({ status: "success", ...serviceResponse });
    } catch (err) {
        logger.error("Error creating user", err);
        response.status(400).json({ status: "error" });
    }
});

router.post("/login", (request: Request, response: Response) => { });

router.post("/update/profile", (request: Request, response: Response) => { });

router.post("/update/password", (request: Request, response: Response) => { });

router.delete("/delete", (request: Request, response: Response) => { });

export default router;
