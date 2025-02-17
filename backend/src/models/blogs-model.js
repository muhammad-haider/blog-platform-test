import { Schema, model } from "mongoose";

const blogsSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: false,
    },
    slug: {
      type: Schema.Types.String,
      required: false,
    },
    description: {
      type: Schema.Types.String,
      required: false,
    },
    content: {
      type: Schema.Types.String,
      required: false,
    },
    coverImage: {
      type: Schema.Types.String,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [Schema.Types.String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const blogsModel = model("Blogs", blogsSchema);
export default blogsModel;
