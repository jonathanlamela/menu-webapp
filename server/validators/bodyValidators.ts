
import * as yup from "yup";

export const postCategory = yup.object({
  body: yup.object({
    name: yup.string().required()
  }),
}).required();

