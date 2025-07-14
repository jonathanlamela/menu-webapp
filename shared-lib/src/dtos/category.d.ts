import { PaginationParams } from "dtos/common";
import { ObjectId } from "mongodb";
import { Category } from "types";

// Request types
export type CreateCategoryRequest = Omit<Category, "id" | "slug" | "deleted"> & {
    image?: Express.Multer.File;
};
export type UpdateCategoryRequest = Partial<Omit<Category, "id" | "slug" | "deleted">> & {
    image?: Express.Multer.File;
};
export type FindCategoryRequest = PaginationParams;

// Response types
export type CreateCategoryResponse = {
    status: string;
    id: ObjectId;
};
export type UpdateCategoryResponse = {
    status: string;
};
export type DeleteCategoryResponse = {
    status: string;
};
export type GetCategoryByIdResponse = {
    status: string;
    category: Category;
};
export type GetCategoryResponse = {
    status: string;
    category: Category;
};
export type FindCategoryResponse = {
    status: string;
    categories: Category[];
    params: FindCategoryRequest;
    count: number;
    page?: number;
    totalPages?: number;
};
