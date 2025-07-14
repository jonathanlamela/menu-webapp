import { PaginationParams, GenericResponse } from "dtos/common";
import { ObjectId } from "mongodb";
import { Product, Category } from "types";

// ProductWithCategory
export type ProductWithCategory = Product & {
    category?: Category;
};

// REQUESTS

export type CreateProductRequest = Omit<Product, "id" | "deleted">;
export type UpdateProductRequest = Partial<Omit<Product, "id" | "deleted">>;

export type GetProductsByCategorySlugParams = PaginationParams & {
    categorySlug: string;
};
export type GetProductsByCategoryIdParams = PaginationParams & {
    categoryId: ObjectId;
};
export type GetProductsByCategorySlugRequest = {
    categorySlug: string;
    params: GetProductsByCategorySlugParams;
};
export type GetProductsByCategoryIdRequest = {
    categoryId: ObjectId;
    params: GetProductsByCategoryIdParams;
};
export type FindProductRequest = PaginationParams;

// RESPONSES

export type CreateProductResponse = GenericResponse & {
    product: Product;
};
export type UpdateProductResponse = GenericResponse;
export type DeleteProductResponse = GenericResponse;
export type GetProductByIdResponse = GenericResponse & {
    product: ProductWithCategory;
};
export type GetProductsByCategorySlugResponse = GenericResponse & {
    products: ProductWithCategory[];
    params: GetProductsByCategorySlugParams;
    categorySlug: string;
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
    products: ProductWithCategory[];
    params: FindProductRequest;
    count: number;
    page?: number;
    totalPages?: number;
};
