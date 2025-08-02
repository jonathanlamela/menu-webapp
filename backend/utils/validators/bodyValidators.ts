
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
