import express, { Request, Response } from "express";
import ProductService from "../services/product";
import { ObjectId } from "mongodb";
import validateRequest from "../utils/validators/validateRequest";
import { postProduct, putProduct } from "../utils/validators/bodyValidators";
import logger from "../utils/logger";
import {
    FindProductRequest,
    FindProductResponse,
    GetProductByIdResponse,
    GetProductsByCategorySlugRequest,
    GetProductsByCategorySlugResponse,
    CreateProductRequest,
    CreateProductResponse,
    UpdateProductRequest,
    UpdateProductResponse,
    DeleteProductResponse,
} from "shared/dtos/product";

const productRoutes = express.Router();


productRoutes.get(
    "/",
    async (
        request: Request<{}, {}, FindProductResponse, FindProductRequest>,
        response: Response<FindProductResponse>
    ) => {
        const service = new ProductService();
        try {
            const {
                orderBy = "id",
                ascending = false,
                search = "",
                deleted = false,
                paginated = true,
                page = "1",
                perPage = "10",
            } = request.query;

            const params: FindProductRequest = {
                orderBy: orderBy as string,
                ascending: ascending,
                search: search as string,
                deleted: deleted,
                paginated: paginated,
                page: parseInt(page as string),
                perPage: parseInt(perPage as string),
            };

            const result: FindProductResponse = await service.find(params);

            response.status(200).json({ status: "success", ...result });
        } catch (err) {
            logger.error("Error fetching products", err);
            response.status(400).json({ status: "error" } as any);
        }
    }
);

productRoutes.get(
    "/:id",
    async (
        request: Request<{ id: string }, GetProductByIdResponse>,
        response: Response<GetProductByIdResponse>
    ) => {
        const service = new ProductService();
        try {
            const productId = request.params.id;
            const product = await service.getById(ObjectId.createFromHexString(productId));

            if (product) {
                response.status(200).json({ status: "success", product });
            } else {
                response.status(404).json({ status: "error" } as any);
            }
        } catch (err) {
            logger.error("Error fetching product by ID", err);
            response.status(400).json({ status: "error" } as any);
        }
    }
);

productRoutes.get(
    "/byCategorySlug/:categorySlug",
    async (
        request: Request<GetProductsByCategorySlugRequest, {}, {}, FindProductRequest>,
        response: Response<GetProductsByCategorySlugResponse>
    ) => {
        const service = new ProductService();
        try {
            const categorySlug = request.params.categorySlug;

            const params: FindProductRequest = {
                orderBy: request.query.orderBy as string || "id",
                ascending: request.query.ascending,
                search: request.query.search as string || "",
                deleted: request.query.deleted,
                paginated: request.query.paginated,
                page: request.query.page || 1,
                perPage: request.query.perPage || 10,
            };
            const serviceResponse: FindProductResponse = await service.getByCategorySlug(categorySlug, params);


            response.status(200).json({ status: "success", products: serviceResponse.products, params, categorySlug });
        } catch (err) {
            logger.error("Error fetching products by category slug", err);
            response.status(400).json({ status: "error" } as any);
        }
    }
);

productRoutes.post(
    "/",
    validateRequest(postProduct),
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
    validateRequest(putProduct),
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
        try {
            var productService = new ProductService()

            await productService.delete(ObjectId.createFromHexString(request.params.id));

            // Implement delete logic here if needed
            response.status(204).json({ status: "success" });
        } catch (err) {
            logger.error("Error deleting product", err);
            response.status(400).json({ status: "error" } as any);
        }
    }
);

export default productRoutes;
