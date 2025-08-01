import * as yup from "yup";
import { ObjectId } from "mongodb";

export const getProductByIdValidator = yup.object({
    params: yup.object({
        id: yup.string()
            .test(
                "is-objectid",
                "${path} is not a valid ObjectId",
                value => value === undefined || ObjectId.isValid(value)
            ).required()
    })
}).required();

export const findProductsValidator = yup.object({
    query: yup.object({
        search: yup.string().optional(),
        deleted: yup.boolean().optional(),
        paginated: yup.boolean().optional(),
        page: yup.number().integer().min(1).optional(),
        perPage: yup.number().integer().min(1).optional(),
        categorySlug: yup.string().optional(),
    })
}).required();

export const postProductValidator = yup.object({
    body: yup.object({
        name: yup.string().min(1, "name should be at least 1 character").required(),
        price: yup.number().typeError("invalid number type").required(
            "price required",
        ).min(
            0.01,
            "price >= 0.01",
        ),
        descriptionShort: yup.string(),
        categoryId: yup.string().required()
    }),
}).required();

export const putProductValidator = yup.object({
    body: yup.object({
        name: yup.string().min(1, "name should be at least 1 character"),
        price: yup.number().typeError("invalid number type").min(
            0.01,
            "price >= 0.01",
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
