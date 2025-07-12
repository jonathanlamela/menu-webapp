import { ObjectId } from "mongodb";

export type Category = {
    id?: ObjectId;
    name: string;
    imageUrl?: string;
}

export type Product = {
    id?: string;
    name: string;
    category?: Category;
    categoryId?: ObjectId;
    price: number;
    ingredients?: string;
    imageUrl?: string;
}
