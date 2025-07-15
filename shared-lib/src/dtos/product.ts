import { ObjectId } from "mongodb";
import { Product, Category } from "../types";
import { PaginationParams, GenericResponse } from "./common";

export type ProductDTO = {
    name: string;
    categoryId?: string;
    price: number;
    descriptionShort?: string;
}

// ProductWithCategory
export type ProductWithCategory = Product & {
    category?: Category;
};

// REQUESTS

export type CreateProductRequest = ProductDTO;
export type UpdateProductRequest = ProductDTO;

export type GetProductsByCategorySlugParams = PaginationParams & {
    categorySlug: string;
};
export type GetProductsByCategoryIdParams = PaginationParams & {
    categoryId: ObjectId;
};
export type GetProductsByCategorySlugRequest = FindProductRequest & {
    categorySlug: string;
};
export type GetProductsByCategoryIdRequest = {
    categoryId: ObjectId;
    params: GetProductsByCategoryIdParams;
};
export type FindProductRequest = { categorySlug?: string } & PaginationParams;

// RESPONSES

export type CreateProductResponse = GenericResponse & {
    id: ObjectId;
};
export type UpdateProductResponse = GenericResponse;
export type DeleteProductResponse = GenericResponse;
export type GetProductByIdResponse = GenericResponse & {
    product: ProductWithCategory;
};
export type GetProductsByCategorySlugResponse = GenericResponse & {
    products?: ProductWithCategory[];
    params?: FindProductRequest;
    categorySlug?: string;
};
export type GetProductsByCategoryIdResponse = GenericResponse & {
    products: ProductWithCategory[];
    params: GetProductsByCategoryIdParams;
    categoryId: ObjectId;
};
export type GetProductsResponse = GenericResponse & {
    products: ProductWithCategory[];
    params: PaginationParams;
};
export type FindProductResponse = GenericResponse & {
    products?: ProductWithCategory[];
    params?: FindProductRequest;
    count: number;
    page?: number;
    totalPages?: number;
};
