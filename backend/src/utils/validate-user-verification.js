import { account_verification } from "./email-template.js";
import { generate_and_save_otp } from "./otp-service.js";
import { send_email } from "./email-service.js";
import User from "../models/user-model.js";
import logger from "../logger/logger.js";

export const validate_user_verification = async (payload) => {
  try {
    const { userId } = payload;

    const user = await User.findById(userId);

    if (!user.isVerified) {
      const otp_key = await generate_and_save_otp(userId);
      const email_data = account_verification(user.fullName, otp_key);
      await send_email(user.email, email_data.subject, email_data.html);
      return true;
    }
    return false;
  } catch (err) {
    logger.error(err.message);
  }
};
