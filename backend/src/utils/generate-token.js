import config from "../config/config.js";
import jwt from "jsonwebtoken";

export const generate_token = (payload) => {
  const { email, id } = payload;

  const token = jwt.sign(
    {
      email: email,
      id: id,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.EXPIRES_IN,
    }
  );
  return token;
};
