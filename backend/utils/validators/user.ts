import * as yup from "yup";
import { ObjectId } from "mongodb";

export const createUserValidator = yup.object({
    body: yup.object({
        email: yup
            .string()
            .email("Invalid email format")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
        confirmPassword: yup
            .string().required("Password confirmation is required")
            .test("passwords-match", "Passwords must match", function (value) {
                return this.parent.password === value;
            }),
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
    }),
}).required();
