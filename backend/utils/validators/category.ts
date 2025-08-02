import * as yup from "yup";
import { ObjectId } from "mongodb";

export const postCategoryValidator = yup.object({
    body: yup.object({
        name: yup.string().required()
    }),
}).required();

export const putCategoryValidator = yup.object({
    body: yup.object({
        name: yup.string().required()
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
