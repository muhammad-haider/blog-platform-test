import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";

export const user_blogs_by_slugs = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blogs = await Blogs.find({ author: req.userId, slug: slug });

    if (blogs.length > 0) {
      return next(
        CustomSuccess.createSuccess(
          { blogs: blogs },
          "Blogs fetched by slug successfully",
          200
        )
      );
    }
    return next(CustomSuccess.createSuccess([], "Blogs not found", 200));
  } catch (err) {
    logger.error(err.message);
    return next(CustomError.createError(err.message, 500));
  }
};
