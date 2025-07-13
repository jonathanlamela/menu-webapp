
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
