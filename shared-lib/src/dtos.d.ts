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
