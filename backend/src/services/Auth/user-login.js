import { validate_account_exists } from "../../utils/verify-account-exists/validate-account-exists.js";
import { validate_user_login } from "../../utils/validators/auth-validator.js";
import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import { generate_token } from "../../utils/generate-token.js";
import User from "../../models/user-model.js";
import logger from "../../logger/logger.js";
import { startSession } from "mongoose";
import { compare } from "bcrypt";

export const user_login = async (req, res, next) => {
  const session = startSession();
  try {
    (await session).startTransaction();

    const { body } = req;

    await validate_user_login.validateAsync(body);

    if (!(await validate_account_exists(body))) {
      return next(CustomError.createError("Your email is incorrect", 400));
    }

    const user = await User.findOne({ email: body.email }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!(await compare(body.password, user.password))) {
      return next(CustomError.createError("Password incorrect", 400));
    }

    (await session).commitTransaction();

    const token = generate_token({
      id: user._id,
      email: user.email,
    });

    return next(
      CustomSuccess.createSuccess(
        {
          user: user,
          token: token,
        },
        "User logged in successfully",
        200
      )
    );
  } catch (err) {
    (await session).abortTransaction();
    logger.error(err.message);
    if (err.code == "11000")
      return next(
        CustomError.createError(
          "A user already logged in with this device",
          400
        )
      );
    return next(CustomError.createError(err.message, 500));
  } finally {
    (await session).endSession();
  }
};
