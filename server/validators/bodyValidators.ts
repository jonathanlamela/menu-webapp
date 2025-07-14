
import * as yup from "yup";

export const postCategory = yup.object({
  body: yup.object({
    name: yup.string().required()
  }),
}).required();

export const putCategory = yup.object({
  body: yup.object({
    name: yup.string().required()
  }),
  params: yup.object({
    id: yup.string().required()
  })
}).required();


export const postProduct = yup.object({
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

export const putProduct = yup.object({
  body: yup.object({
    name: yup.string().min(1, "name should be at least 1 character"),
    price: yup.number().typeError("invalid number type").min(
      0.01,
      "price >= 0.01",
    ),
  }),
  params: yup.object({
    id: yup.string().required()
  })
}).required();
