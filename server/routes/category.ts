import express from "express";
import CategoryService from "../services/category";
import validateRequest from "../utils/validators/validateRequest";
import { postCategory, putCategory } from "../utils/validators/bodyValidators";
import { ObjectId } from "mongodb";
import { FindCategoryRequest, CreateCategoryRequest, UpdateCategoryRequest, FindCategoryResponse, CreateCategoryResponse, GetCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse } from "@shared/dtos/category";
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
            logger.error("Error fetching categories", err);
            response.status(400).json({ status: "error" });
        }
    });

categoryRoutes.get("/:id",
    async (
        request: TypedRequest<{}, CreateCategoryRequest>,
        response: TypedResponse<CreateCategoryResponse>
    ) => {
        const categoryService = new CategoryService();
        try {
            const serviceResponse = await categoryService.getById(ObjectId.createFromHexString(request.params.id));
            if (serviceResponse.category) {
                response.status(200).json({ status: "success", ...serviceResponse });
            } else {
                response.status(404).json({ status: "error", error: "no category found" });
            }
        } catch (err) {
            logger.error("Error fetching category by ID", err);
            response.status(400).json({ status: "error" });
        }
    });

categoryRoutes.get("/bySlug/:slug",
    async (
        request: TypedRequest<{}, {}, { slug: string }>,
        response: TypedResponse<GetCategoryResponse>
    ) => {
        const categoryService = new CategoryService();
        try {
            const serviceResponse = await categoryService.getBySlug(request.params.slug);
            if (serviceResponse.category) {
                response.status(200).json({ status: "success", ...serviceResponse });
            } else {
                response.status(404).json({ status: "error" });
            }
        } catch (err) {
            logger.error("Error fetching category by slug", err);
            response.status(400).json({ status: "error" });
        }
    });

//TODO: Require user logged with admin role
categoryRoutes.post("/", upload.single("image"), validateRequest(postCategory),
    async (
        request: TypedRequest<{}, CreateCategoryRequest>,
        response: TypedResponse<CreateCategoryResponse>
    ) => {
        const data = request.body as CreateCategoryRequest;
        const categoryService = new CategoryService();
        try {
            if (request.file) {
                data.image = request.file;
            }
            const serviceResponse = await categoryService.create(data);
            response.status(201).json({ status: "success", ...serviceResponse });
        } catch (err) {
            logger.error("Error creating category", err);
            response.status(400).json({ status: "error" });
        }
    });

//TODO: Require user logged with admin role
categoryRoutes.put("/:id", upload.single("image"), validateRequest(putCategory),
    async (
        request: TypedRequest<{}, UpdateCategoryRequest, { id: string }>,
        response: TypedResponse<UpdateCategoryResponse>
    ) => {
        const data = request.body as UpdateCategoryRequest;
        const categoryService = new CategoryService();
        try {
            if (request.file) {
                data.image = request.file;
            }
            await categoryService.update(ObjectId.createFromHexString(request.params.id), data);
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
        const categoryService = new CategoryService();
        try {
            await categoryService.delete(ObjectId.createFromHexString(request.params.id));
            response.status(204).json({ status: "success" });
        } catch (err) {
            logger.error("Error deleting category", err);
            response.status(400).json({ status: "error" });
        }
    });

export default categoryRoutes;
