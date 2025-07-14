import { Category } from "types";
export type CreateCategoryRequest = {
    name: string;
    image?: Express.Multer.File;
}

export type UpdateCategoryRequest = {
    name: string;
    image?: Express.Multer.File;
}

export type FindCategoryRequest = {
    orderBy?: string;
    ascending?: boolean;
    search?: string;
    deleted?: boolean;
    paginated?: boolean;
    page?: number;
    perPage?: number;
}
export type CategoryWithoutDelete = Omit<Category, "deleted">;

//Product
import { Product } from "types"

export type CreateProductRequest = {
    name: string;
    categoryId: string;
    descriptionShort?: string;
    price: number;
}

export type UpdateProductRequest = {
    name: string;
    categoryId: string;
    descriptionShort?: string;
    price: number;
}

export type FindProductRequest = {
    orderBy?: string;
    ascending?: boolean;
    search?: string;
    deleted?: boolean;
    paginated?: boolean;
    page?: number;
    perPage?: number;
}

export type ProductWithoutDelete = Omit<Product, "deleted">;
