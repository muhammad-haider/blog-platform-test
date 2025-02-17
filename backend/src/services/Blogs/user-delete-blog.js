import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import Blogs from "../../models/blogs-model.js";
import logger from "../../logger/logger.js";

export const user_delete_blog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blogs.findOneAndDelete({
      _id: id,
      author: req.userId,
    });

    if (!blog) {
      return next(CustomError.createError("Blog not found", 404));
    }

    return next(
      CustomSuccess.createSuccess("", "Blog deleted successfully", 200)
    );
  } catch (err) {
    logger.error(err.message);
    return next(CustomError.createError(err.message, 500));
  }
};
