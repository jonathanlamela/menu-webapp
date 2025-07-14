import { PaginationParams } from "dtos/common";
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

export type CreateProductResponse = {
    status: string;
    product: Product;
};
export type UpdateProductResponse = {
    status: string;
};
export type DeleteProductResponse = {
    status: string;
};
export type GetProductByIdResponse = {
    status: string;
    product: ProductWithCategory;
};
export type GetProductsByCategorySlugResponse = {
    status: string;
    products: ProductWithCategory[];
    params: GetProductsByCategorySlugParams;
    categorySlug: string;
};
export type GetProductsByCategoryIdResponse = {
    status: string;
    products: ProductWithCategory[];
    params: GetProductsByCategoryIdParams;
    categoryId: ObjectId;
};
export type GetProductsResponse = {
    status: string;
    products: ProductWithCategory[];
    params: PaginationParams;
};
export type FindProductResponse = {
    status: string;
    products: ProductWithCategory[];
    params: FindProductRequest;
    count: number;
    page?: number;
    totalPages?: number;
};
