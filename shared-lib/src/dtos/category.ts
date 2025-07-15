import { ObjectId } from "mongodb";
import { Category } from "../types";
import { PaginationParams, GenericResponse } from "./common";



// Request types
export type CreateCategoryRequest = Omit<Category, "id" | "slug" | "deleted"> & {
    image?: Express.Multer.File;
};
export type UpdateCategoryRequest = Partial<Omit<Category, "id" | "slug" | "deleted">> & {
    image?: Express.Multer.File;
};
export type FindCategoryRequest = PaginationParams;

// Response types
export type CreateCategoryResponse = GenericResponse & {
    id?: ObjectId;
};
export type UpdateCategoryResponse = GenericResponse;
export type DeleteCategoryResponse = GenericResponse;
export type GetCategoryByIdResponse = GenericResponse & {
    category: Category | null;
};
export type GetCategoryResponse = GenericResponse & {
    category?: Category | null;
};
export type FindCategoryResponse = GenericResponse & {
    categories?: Category[];
    params?: FindCategoryRequest;
    count?: number;
    page?: number;
    totalPages?: number;
};
