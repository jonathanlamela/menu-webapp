import express, { Request, Response } from "express";
import ProductService from "../services/product";
import { ObjectId } from "mongodb";
import validateRequest from "../utils/validators/validateRequest";
import { findProductsValidator, getProductByIdValidator, postProductValidator, putProductValidator } from "../utils/validators/bodyValidators";
import logger from "../utils/logger";
import {
    FindProductRequest,
    FindProductResponse,
    GetProductByIdResponse,
    CreateProductRequest,
    CreateProductResponse,
    UpdateProductRequest,
    UpdateProductResponse,
    DeleteProductResponse,
} from "shared/dtos/product";

const productRoutes = express.Router();


productRoutes.get(
    "/",
    validateRequest(findProductsValidator),
    async (
        request: Request<{}, FindProductResponse, {}, any>,
        response: Response<FindProductResponse>
    ) => {
        const {
            orderBy = "id",
            ascending = "false",
            search = "",
            deleted = "false",
            paginated = "true",
            page = "1",
            perPage = "10",
            categorySlug = null,
        } = request.query;

        const params: FindProductRequest = {
            orderBy: orderBy as string,
            ascending: String(ascending) === "true",
            search: search as string,
            deleted: String(deleted) === "true",
            paginated: String(paginated) === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
            categorySlug: categorySlug || null,
        };

        const result: FindProductResponse = await new ProductService().find(params);

        response.status(200).json({ status: "success", ...result });
    }
);

productRoutes.get(
    "/:id",
    validateRequest(getProductByIdValidator),
    async (
        request: Request<{ id: string }, GetProductByIdResponse>,
        response: Response<GetProductByIdResponse>
    ) => {
        const productId = request.params.id;
        const product = await new ProductService().getById(ObjectId.createFromHexString(productId));

        if (product && product.deleted === false) {
            response.status(200).json({ status: "success", product });
        } else {
            response.status(404).json({ status: "error" } as any);
        }
    }
);


productRoutes.post(
    "/",
    validateRequest(postProductValidator),
    async (
        request: Request<{}, CreateProductResponse, CreateProductRequest>,
        response: Response<CreateProductResponse>
    ) => {
        const service = new ProductService();
        try {
            const productData = request.body as CreateProductRequest;
            const createdProduct = await service.create(productData);

            response.status(201).json({ status: "success", id: createdProduct });
        } catch (err) {
            logger.error("Error creating product", err);
            response.status(400).json({ status: "error" } as any);
        }
    }
);

productRoutes.put(
    "/:id",
    validateRequest(putProductValidator),
    async (
        request: Request<{
            id: string
        }, UpdateProductResponse, UpdateProductRequest>,
        response: Response<UpdateProductResponse>
    ) => {
        const service = new ProductService();
        try {
            const productId = request.params.id;
            const productData = request.body;
            await service.update(ObjectId.createFromHexString(productId), productData);

            response.status(204).json({ status: "success" });
        } catch (err) {
            logger.error("Error updating product", err);
            response.status(400).json({ status: "error" } as any);
        }
    }
);

productRoutes.delete(
    "/:id",
    async (
        request: Request<{
            id: string;
        }>,
        response: Response<DeleteProductResponse>
    ) => {
        await new ProductService().delete(ObjectId.createFromHexString(request.params.id));
        // Implement delete logic here if needed
        response.status(204).json({ status: "success" });
    }
);

export default productRoutes;
