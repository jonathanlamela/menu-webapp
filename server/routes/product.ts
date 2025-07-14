import express, { Request, Response } from "express";
import ProductService from "../services/product";
import { ObjectId } from "mongodb";
import validateRequest from "../utils/validators/validateRequest";
import { postProduct, putProduct } from "../utils/validators/bodyValidators";
import { FindProductRequest, CreateProductRequest } from "@shared/dtos/product";

const productRoutes = express.Router()

productRoutes.get("/", async (request: Request, response: Response) => {
    const service = new ProductService();
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

        const params: FindProductRequest = {
            orderBy: orderBy as string,
            ascending: ascending === "true",
            search: search as string,
            deleted: deleted === "true",
            paginated: paginated === "true",
            page: parseInt(page as string),
            perPage: parseInt(perPage as string),
        }

        response.status(200).json(await service.find(params));
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to fetch products" });
    }
});

productRoutes.get("/:id", async (request: Request, response: Response) => {
    const service = new ProductService();
    try {
        const productId = request.params.id;
        const product = await service.getById(ObjectId.createFromHexString(productId));

        if (product) {
            response.status(200).json({ status: "success", product });
        } else {
            response.status(404).json({ status: "no product found" });
        }
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to fetch product" });
    }
});

productRoutes.get("/byCategorySlug/:categorySlug", async (request: Request, response: Response) => {
    const service = new ProductService();
    try {
        const categorySlug = request.params.categorySlug;

        const params: FindProductRequest = {
            orderBy: request.query.orderBy as string || "id",
            ascending: request.query.ascending === "true",
            search: request.query.search as string || "",
            deleted: request.query.deleted === "true",
            paginated: request.query.paginated === "true",
            page: parseInt(request.query.page as string) || 1,
            perPage: parseInt(request.query.perPage as string) || 10,
        };
        const products = await service.getByCategorySlug(categorySlug, params);

        response.status(200).json({ status: "success", products, params, categorySlug });

    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to fetch products by category slug" });
    }
});

productRoutes.post("/", validateRequest(postProduct), async (request: Request, response: Response) => {
    const service = new ProductService();
    try {
        const productData = request.body as CreateProductRequest;
        const createdProduct = await service.create(productData);

        response.status(201).json({ status: "success", product: createdProduct });
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to create product" });
    }
});

productRoutes.put("/:id", validateRequest(putProduct), async (request: Request, response: Response) => {
    const service = new ProductService();
    try {
        const productId = request.params.id;
        const productData = request.body;
        const updatedProduct = await service.update(ObjectId.createFromHexString(productId), productData);

        response.status(200).json({ status: "success", product: updatedProduct });
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to update product" });
    }
});

productRoutes.delete("/:id", async (request: Request, response: Response) => {
    const service = new ProductService();
    try {
        const productId = request.params.id;
        await service.delete(ObjectId.createFromHexString(productId));

        response.status(204).send();
    } catch (err) {
        console.error(err);
        response.status(400).json({ status: "error", message: "Unable to delete product" });
    }
});

export default productRoutes;
