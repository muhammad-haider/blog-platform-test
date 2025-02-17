import findconfig from "find-config";
import dotenv from "dotenv";

dotenv.config({ path: findconfig(".env") });

export default {
  // MAIL_USERNAME: process.env.MAIL_USERNAME,
  // MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  BEARER_TOKEN: process.env.BEARER_TOKEN,
  PW_SALT_VAL: process.env.PW_SALT_VAL,
  EXPIRES_IN: process.env.EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  // MAIL_HOST: process.env.MAIL_HOST,
  // MAIL_PORT: process.env.MAIL_PORT,
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT,
};
