import { ObjectId } from "mongodb";
import { GenericResponse } from "./common";

export type UserDTO = {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: string;
}

export type CreateUserRequest = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
};

export type CreateUserResponse = GenericResponse & {
    id?: ObjectId;
}
