import { ObjectId } from "mongodb";

interface BaseModel {
    _id?: ObjectId;
    deleted?: boolean;
}

export interface Category extends BaseModel {
    name: string;
    slug?: string;
    imageUrl?: string;
}

export interface Product extends BaseModel {
    name: string;
    categoryId?: ObjectId;
    price: number;
    descriptionShort?: string;
}

export interface OrderState extends BaseModel {
    name: string;
    badgeColor?: string;
}

export interface Carrier extends BaseModel {
    name: string;
    costs: number;
}


