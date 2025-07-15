import { ObjectId } from "mongodb";

export type Category = {
    _id?: ObjectId;
    name: string;
    slug?: string;
    imageUrl?: string;
    deleted?: boolean;
}

export type Product = {
    _id?: ObjectId;
    name: string;
    categoryId?: ObjectId;
    price: number;
    descriptionShort?: string;
    deleted?: boolean;
}

export type OrderState = {
    _id?: ObjectId;
    name: string;
    badgeColor?: string;
    deleted?: boolean;
};

export type Carrier = {
    _id?: ObjectId;
    name: string;
    costs: number;
    deleted?: boolean;
};


