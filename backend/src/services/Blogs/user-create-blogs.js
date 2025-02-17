import { validate_create_blogs } from "../../utils/validators/blogs-validator.js";
import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";
import { startSession } from "mongoose";

export const user_create_blogs = async (req, res, next) => {
  const session = startSession();
  try {
    (await session).startTransaction();

    const { body } = req;
    await validate_create_blogs.validateAsync(body);

    if (!req.file) {
      return next(CustomError.createError("Cover image is required", 400));
    }

    const blogs = await new Blogs({
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content,
      author: req.userId,
      tags: body.tags,
      coverImage: req.file.filename,
    }).save(session);

    (await session).commitTransaction();

    if (blogs) {
      return next(
        CustomSuccess.createSuccess(blogs, "Blog created successfully", 201)
      );
    }
  } catch (err) {
    (await session).abortTransaction();
    logger.error(err.message);
    return next(CustomError.createError(err.message, 500));
  } finally {
    (await session).endSession();
  }
};
