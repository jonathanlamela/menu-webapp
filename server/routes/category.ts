import express from "express";
import CategoryService from "../services/category";
import validateRequest from "../utils/validators/validateRequest";
import { postCategoryValidator, putCategoryValidator } from "../utils/validators/bodyValidators";
import { ObjectId } from "mongodb";
import { FindCategoryRequest, CreateCategoryRequest, UpdateCategoryRequest, FindCategoryResponse, CreateCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse } from "shared/dtos/category";
import logger from "../utils/logger";

import { TypedRequest, TypedResponse } from "../types";

const categoryRoutes = express.Router()
const multer = require('multer');
const upload = multer();

categoryRoutes.get("/",
    async (
        request: TypedRequest<FindCategoryRequest, {}>,
        response: TypedResponse<FindCategoryResponse>
    ) => {
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
            ascending: String(ascending) === "true",
            search: search as string,
            deleted: String(deleted) === "true",
            paginated: String(paginated) === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
            slug: request.query.slug
        }

        const serviceResponse = await new CategoryService().find(params);
        response.status(200).json({ status: "success", ...serviceResponse });
    });

categoryRoutes.get("/:id",
    async (
        request: TypedRequest<{}, CreateCategoryRequest>,
        response: TypedResponse<CreateCategoryResponse>
    ) => {
        const serviceResponse = await new CategoryService().getById(ObjectId.createFromHexString(request.params.id));
        if (serviceResponse.category && serviceResponse.category.deleted == false) {
            response.status(200).json({ status: "success", ...serviceResponse });
        } else {
            response.status(404).json({ status: "error", error: "no category found" });
        }
    });


//TODO: Require user logged with admin role
categoryRoutes.post("/", upload.single("image"), validateRequest(postCategoryValidator),
    async (
        request: TypedRequest<{}, CreateCategoryRequest>,
        response: TypedResponse<CreateCategoryResponse>
    ) => {
        const data = request.body as CreateCategoryRequest;
        try {
            if (request.file) {
                data.image = request.file;
            }
            const serviceResponse = await new CategoryService().create(data);
            response.status(201).json({ status: "success", ...serviceResponse });
        } catch (err) {
            logger.error("Error creating category", err);
            response.status(400).json({ status: "error" });
        }
    });

//TODO: Require user logged with admin role
categoryRoutes.put("/:id", upload.single("image"), validateRequest(putCategoryValidator),
    async (
        request: TypedRequest<{}, UpdateCategoryRequest, { id: string }>,
        response: TypedResponse<UpdateCategoryResponse>
    ) => {
        const data = request.body as UpdateCategoryRequest;
        try {
            if (request.file) {
                data.image = request.file;
            }
            await new CategoryService().update(ObjectId.createFromHexString(request.params.id), data);
            response.status(200).json({ status: "success" });
        } catch (err) {
            logger.error("Error updating category", err);
            response.status(400).json({ status: "error" });
        }
    });

categoryRoutes.delete("/:id",
    async (
        request: TypedRequest<{}, {}, { id: string }>,
        response: TypedResponse<DeleteCategoryResponse>
    ) => {
        await new CategoryService().delete(ObjectId.createFromHexString(request.params.id));
        response.status(204).json({ status: "success" });
    });

export default categoryRoutes;
