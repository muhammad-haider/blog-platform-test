import { validate_edit_blog } from "../../utils/validators/blogs-validator.js";
import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";

export const user_edit_blog = async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = req.params;

    await validate_edit_blog.validateAsync(body);

    const existing_blog = await Blogs.findOne({ _id: id, author: req.userId });
    if (!existing_blog) {
      return next(
        CustomError.createError("Blog not found or unauthorized", 404)
      );
    }

    const updated_blog = await Blogs.findOneAndUpdate(
      { _id: id, author: req.userId },
      {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        tags: body.tags,
        coverImage: req.file?.filename || existing_blog.coverImage,
      },
      { returnDocument: "after", new: true }
    );

    if (!updated_blog) {
      return next(CustomError.createError("Failed to update blog", 500));
    }

    return next(
      CustomSuccess.createSuccess(
        updated_blog,
        "Blog updated successfully",
        200
      )
    );
  } catch (err) {
    logger.error(err.message);
    return next(CustomError.createError(err.message, 500));
  }
};
