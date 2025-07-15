import { ObjectId } from "mongodb";

export type Category = {
    id?: ObjectId;
    name: string;
    slug?: string;
    imageUrl?: string;
    deleted?: boolean;
}

export type Product = {
    id?: ObjectId;
    name: string;
    categoryId?: ObjectId | null | string;
    price: number;
    descriptionShort?: string;
    deleted?: boolean;
}

export type OrderState = {
    id?: ObjectId;
    name: string;
    badgeColor?: string;
    deleted?: boolean;
};

export type Carrier = {
    id?: ObjectId;
    name: string;
    costs: number;
    deleted?: boolean;
};


