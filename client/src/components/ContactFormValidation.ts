import * as yup from "yup";

export const ValidationContactForm = () => {
  const regExp = /\b\d{6}\b/;

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("email is required")
      .email("wrong email format")
      .max(256, "max length is 256"),
    number: yup
      .string()
      .nullable()
      .transform((value) => value.replace(/[^\d]/g, ""))
      .matches(regExp, {
        message: "must be exactly 6 numbers",
        excludeEmptyString: true,
      }),
  });

  return schema;
};
