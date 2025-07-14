import { PaginationParams } from "dtos/common";
import { ObjectId } from "mongodb";
import { Category } from "types";

// Category

export type CreateCategoryRequest = Omit<Category, "id" | "slug" | "deleted"> & {
    image?: Express.Multer.File;
};
export type UpdateCategoryRequest = Partial<Omit<Category, "id" | "slug" | "deleted">> & {
    image?: Express.Multer.File;
};
export type CreateCategoryResponse = {
    status: string;
    id: ObjectId;
};
export type UpdateCategoryResponse = {
    status: string;
    id: ObjectId;
};
export type DeleteCategoryResponse = {
    status: string;
};
export type GetCategoryByIdRequest = {
    categoryId: ObjectId;
};
export type GetCategoryByIdResponse = {
    status: string;
    category: Category;
};

export type GetCategoryResponse = {
    status: string;
    category: Category;
};


export type FindCategoryRequest = PaginationParams;
export type FindCategoryResponse = {
    status: string;
    categories: Category[];
    params: FindCategoryRequest;
    count: number;
    page?: number;
    totalPages?: number;
};

