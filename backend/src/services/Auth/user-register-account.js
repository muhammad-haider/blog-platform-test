import { validate_account_exists } from "../../utils/verify-account-exists/validate-account-exists.js";
import { validate_register_account } from "../../utils/validators/auth-validator.js";
import CustomSuccess from "../../utils/custom-response/custom-success.js";
import CustomError from "../../utils/custom-response/custom-error.js";
import User from "../../models/user-model.js";
import logger from "../../logger/logger.js";
import config from "../../config/config.js";
import { startSession } from "mongoose";
import { hash } from "bcrypt";

export const user_register_account = async (req, res, next) => {
  const session = startSession();
  try {
    (await session).startTransaction();

    const { body } = req;

    await validate_register_account.validateAsync(body);

    if (await validate_account_exists(body)) {
      return next(CustomError.createError("Email already exist", 400));
    }

    const hashed_password = await hash(
      body.password,
      parseInt(config.PW_SALT_VAL)
    );

    const create_user = await new User({
      fullName: body.fullName,
      email: body.email,
      password: hashed_password,
    }).save(session);

    (await session).commitTransaction();

    if (create_user) {
      return next(
        CustomSuccess.createSuccess(
          {
            user: create_user,
          },
          "User registered successfully",
          201
        )
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
