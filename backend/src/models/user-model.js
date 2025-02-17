import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: false,
    },
    status: {
      type: Schema.Types.String,
      default: "active",
      enum: ["active", "inactive", "blocked"],
    },
    email: {
      type: Schema.Types.String,
      required: false,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      default: "",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;
