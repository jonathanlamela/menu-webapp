
export type CreateCategoryRequest = {
    name: string;
    image?: Express.Multer.File;
}

export type UpdateCategoryRequest = {
    name?: string;
    imageUrl?: string;
}
