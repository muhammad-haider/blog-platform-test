import joi from "joi";

export const validate_create_blogs = joi.object({
  title: joi.string().min(3).max(100).required(),
  slug: joi
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
  description: joi.string().max(500).required(),
  content: joi.string().min(50).required(),
  tags: joi.array().items(joi.string().trim().max(30)).max(10).optional(),
});

export const validate_edit_blog = joi.object({
  title: joi.string().min(3).max(100).required().optional(),
  slug: joi
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
    .optional(),
  description: joi.string().max(500).required().optional(),
  content: joi.string().min(50).required().optional(),
  tags: joi.array().items(joi.string().trim().max(30)).max(10).optional(),
});
