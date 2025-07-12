import { Category } from "types/category";

export type Product = {
    id?: string;
    name: string;
    category?: Category;
    categoryId?: string;
    price: number;
    ingredients?: string;
}
