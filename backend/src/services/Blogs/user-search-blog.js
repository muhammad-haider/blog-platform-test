import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";

export const user_search_blog = async (req, res, next) => {
  try {
    const search = req.query.q;

    const blogs = await Blogs.find({
      author: req.userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    });

    if (blogs.length > 0) {
      return next(
        CustomSuccess.createSuccess(blogs, "Blogs fetched successfully", 200)
      );
    }
    return next(CustomSuccess.createSuccess("blogs not found", 400));
  } catch (err) {
    logger.error(err.message);
    return next(CustomError.createError(err.message, 500));
  }
};
