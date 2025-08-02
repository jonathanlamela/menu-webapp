import * as yup from "yup";
import { ObjectId } from "mongodb";

export const findCarriersValidator = yup.object({
    query: yup.object({
        search: yup.string().optional(),
        deleted: yup.boolean().optional(),
        paginated: yup.boolean().optional(),
        page: yup.number().integer().min(1).optional(),
        perPage: yup.number().integer().min(1).optional(),
    })
}).required();

export const postCarrierValidator = yup.object({
    body: yup.object({
        name: yup.string().required(),
        costs: yup.number().typeError("invalid number").required().min(
            0.00,
            "costs should be >= 0.00",
        ),
    }),
}).required();

export const putCarrierValidator = yup.object({
    body: yup.object({
        name: yup.string().min(1, "name should be at least 1 character").required(),
        costs: yup.number().typeError("invalid number").min(
            0.00,
            "costs should be >= 0.00",
        ),
    }),
    params: yup.object({
        id: yup.string()
            .test(
                "is-objectid",
                "${path} is not a valid ObjectId",
                value => value === undefined || ObjectId.isValid(value)
            ).required()
    })
}).required();
