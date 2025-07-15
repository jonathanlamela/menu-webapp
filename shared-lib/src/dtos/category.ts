import { ObjectId } from "mongodb";
import { Category } from "../types";
import { PaginationParams, GenericResponse } from "./common";

export type CategoryDTO = {
    name: string;
}

// Request types
export type CreateCategoryRequest = CategoryDTO & {
    image?: Express.Multer.File;
};
export type UpdateCategoryRequest = CategoryDTO & {
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

