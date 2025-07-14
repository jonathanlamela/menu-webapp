import express, { Request, Response } from "express";
import CategoryService from "../services/category";
import validateRequest from "../utils/validators/validateRequest";
import { postCategory, putCategory } from "../utils/validators/bodyValidators";
import { ObjectId } from "mongodb";
import { FindCategoryRequest, CreateCategoryRequest, UpdateCategoryRequest } from "@shared/dtos/category";

const categoryRoutes = express.Router()
const multer = require('multer');
const upload = multer();

categoryRoutes.get("/", async (request: Request, response: Response) => {
    const categoryService = new CategoryService();
    try {
        const {
            orderBy = "id",
            ascending = "false",
            search = "",
            deleted = "false",
            paginated = "true",
            page = "1",
            perPage = "10",
        } = request.query;

        const params: FindCategoryRequest = {
            orderBy: orderBy as string,
            ascending: ascending === "true",
            search: search as string,
            deleted: deleted === "true",
            paginated: paginated === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
        }

        const serviceResponse = await categoryService.find(params);
        response.status(200).json({ status: "success", ...serviceResponse });
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

categoryRoutes.get("/:id", async (request: Request, response: Response) => {
    const categoryService = new CategoryService();
    try {
        const serviceResponse = await categoryService.getById(ObjectId.createFromHexString(request.params.id));
        if (serviceResponse.category) {
            response.status(200).json({ status: "success", ...serviceResponse });
        } else {
            response.status(404).json({ status: "error", error: "no category found" });
        }
    } catch (err) {
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

categoryRoutes.get("/bySlug/:slug", async (request: Request, response: Response) => {
    const categoryService = new CategoryService();
    try {
        const serviceResponse = await categoryService.getBySlug(request.params.slug);
        if (serviceResponse.category) {
            response.status(200).json({ status: "success", ...serviceResponse });
        } else {
            response.status(404).json({ status: "error", error: "no category found" });
        }
    } catch (err) {
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

//TODO: Require user logged with admin role
categoryRoutes.post("/", upload.single("image"), validateRequest(postCategory), async (request: Request, response: Response) => {
    const data = request.body as CreateCategoryRequest;
    const categoryService = new CategoryService();
    try {
        if (request.file) {
            data.image = request.file;
        }
        const serviceResponse = await categoryService.create(data);
        response.status(200).json({ status: "success", ...serviceResponse });
    } catch (err) {
        console.log(err);
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

//TODO: Require user logged with admin role
categoryRoutes.put("/:id", upload.single("image"), validateRequest(putCategory), async (request: Request, response: Response) => {
    const data = request.body as UpdateCategoryRequest;
    const categoryService = new CategoryService();
    try {
        if (request.file) {
            data.image = request.file;
        }
        const serviceResponse = await categoryService.update(ObjectId.createFromHexString(request.params.id), data);
        response.status(202).json({ status: "success", ...serviceResponse });
    } catch (err) {
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

categoryRoutes.delete("/:id", async (request: Request, response: Response) => {
    const categoryService = new CategoryService();
    try {
        const serviceResponse = await categoryService.delete(ObjectId.createFromHexString(request.params.id));
        response.status(202).json({ status: "success", ...serviceResponse });
    } catch (err) {
        console.log(err);
        response.status(400).json({ status: "error", error: err instanceof Error ? err.message : String(err) });
    }
});

export default categoryRoutes;
