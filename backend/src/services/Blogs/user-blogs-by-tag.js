import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";

export const user_blogs_by_tagName = async (req, res, next) => {
  try {
    const tag_name = req.params.tag_name;

    const blogs = await Blogs.find({
      author: req.userId,
      tags: { $in: [tag_name] },
    });

    if (blogs.length > 0) {
      return next(
        CustomSuccess.createSuccess(
          blogs,
          "Blogs fetched by tagName successfully",
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
