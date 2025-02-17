import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";

export const user_get_blogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blogs.find({ author: req.userId })
      .skip(skip)
      .limit(limit);

    if (blogs.length > 0) {
      return next(
        CustomSuccess.createSuccess(
          { blogs: blogs },
          "Blogs fetched successfully",
          200
        )
      );
    }
    return next(CustomError.createError("User blogs not found", 200));
  } catch (err) {
    logger.error(err.message);
    return next(CustomError.createError(err.message, 500));
  }
};
