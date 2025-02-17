import joi from "joi";

export const validate_register_account = joi.object({
  fullName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const validate_user_login = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
