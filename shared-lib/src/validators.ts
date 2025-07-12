import backendApi from "lib/backendApi";
import { ObjectId } from "mongodb";
import { Category, OrderState } from "types";

import * as yup from "yup";

export const categoryValidator = yup.object({
  id: yup.mixed<ObjectId>().nullable(),
  name: yup.string().required("The name field is required"),
  imageUrl: yup.string().nullable(),
  slug: yup.string().nullable(),
  deleted: yup.boolean().nullable(),
  imageFile: yup
    .mixed<FileList>()
    .nullable()
    .test("fileSize", "File too large (max 1MB)", (value: any) => {
      if (value == undefined || value.length === 0) {
        return true;
      }
      return value.length && value[0].size <= 1000 * 1000;
    })
    .test("fileFormat", "Unsupported file format", (value: any) => {
      if (value == undefined || value.length === 0) {
        return true;
      }
      return (
        value[0] &&
        ["image/jpg", "image/jpeg", "image/png"].includes(value[0].type)
      );
    }),
}).required();

export const changePasswordValidator = yup
  .object({
    currentPassword: yup.string().required("Current password is required"),
    password: yup
      .string()
      .matches(
        RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        ),
        "Password must be at least 8 characters and include a number, a special character, and an uppercase letter"
      )
      .required("Password field is required"),
    passwordConfirmation: yup
      .string()
      .required("Confirm password field is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

export const foodValidator = yup
  .object({
    id: yup.mixed<ObjectId>().nullable(),
    name: yup.string().required("Name field is required"),
    price: yup
      .number()
      .typeError("Enter a valid number")
      .required("Price field is required")
      .min(0.01, "Price must be greater than 0"),
    ingredients: yup.string().nullable(),
    categoryId: yup
      .mixed<ObjectId>()
      .nullable()
      .required("Category is required"),
    category: yup.mixed<Category>().nullable(),
    deleted: yup.boolean().nullable(),
  })
  .required();

export const carrierValidator = yup
  .object({
    id: yup.mixed<ObjectId>().nullable(),
    name: yup.string().required("Name field is required"),
    costs: yup
      .number()
      .typeError("Enter a valid number")
      .required("Price field is required")
      .min(0.0, "Price must be 0 or greater"),
    deleted: yup.boolean().nullable(),
  })
  .required();

export const orderStateValidator = yup
  .object({
    id: yup.mixed<ObjectId>().nullable(),
    name: yup.string().required("Name field is required"),
    cssBadgeClass: yup.string().nullable(),
    deleted: yup.boolean().nullable(),
  })
  .required();

export const deliveryInfoValidator = yup
  .object({
    deliveryAddress: yup.string().nullable(),
    deliveryTime: yup.string().required("Delivery time is required"),
  })
  .required();

export const loginValidator = yup
  .object({
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("This field is required"),
    password: yup.string().required("Password field is required"),
    callbackUrl: yup.string(),
  })
  .required();

export const personalInfoValidator = yup
  .object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
  })
  .required();

export const resetPasswordTokenValidator = yup
  .object({
    token: yup.string().required("This field is required"),
    password: yup
      .string()
      .matches(
        RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        ),
        "Password must be at least 8 characters and include a number, a special character, and an uppercase letter"
      )
      .required("Password field is required"),
    confirmPassword: yup
      .string()
      .required("Confirm password field is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

export const resetPasswordValidator = yup
  .object({
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("This field is required"),
  })
  .required();

export const settingValidator = yup.object({
  id: yup.mixed<ObjectId>().nullable(),

  siteTitle: yup.string().required("Site title is required"),
  siteSubtitle: yup.string().nullable(),
  orderStateCreatedId: yup.mixed<ObjectId>().required("Select a valid order state"),
  orderStatePaidId: yup.mixed<ObjectId>().required("Select a valid order state"),
  orderStateDeletedId: yup.mixed<ObjectId>().required("Select a valid order state"),
  orderStateCreated: yup.mixed<OrderState>().nullable(),
  orderStatePaid: yup.mixed<OrderState>().nullable(),
  orderStateDeleted: yup.mixed<OrderState>().nullable(),
});

const verifyEmail = async (value: string, values: yup.TestContext<any>) => {
  if (value.length > 0) {
    const response = await backendApi.get("/account/verifyEmailBusy", {
      params: {
        email: value,
      },
    });

    const { result } = response.data;

    if (result === true) {
      values.createError({ path: "email" });
    }

    return !result;
  } else {
    return false;
  }
};

export const signinValidator = yup
  .object({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("This field is required")
      .test("is-busy", "Email already in use", async function (value, values) {
        return await verifyEmail(value!, values);
      }),
    password: yup
      .string()
      .matches(
        RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        ),
        "Password must be at least 8 characters and include a number, a special character, and an uppercase letter"
      )
      .required("Password field is required"),
    passwordConfirmation: yup
      .string()
      .required("Confirm password field is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

export const verifyAccountValidator = yup
  .object({
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("This field is required"),
  })
  .required();

export const updateOrderStatusValidator = yup
  .object({
    orderStateId: yup.mixed<ObjectId>().required("Order state is required"),
  })
  .required();

export const updateOrderDetailsAddItemValidator = yup
  .object({
    itemId: yup.mixed<ObjectId>().required("Item ID is required"),
  })
  .required();

export const pickDeliveryMethodValidator = yup
  .object({
    carrierId: yup.mixed<ObjectId>().required("Please select a delivery method"),
  })
  .required();
