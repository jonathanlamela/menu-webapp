
import * as yup from "yup";

export const categoryValidator = yup.object({
  name: yup.string().required("The name field is required"),
}).required();

