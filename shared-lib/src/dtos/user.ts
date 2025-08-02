
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
