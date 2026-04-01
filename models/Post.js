import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../database/db.js";

class Post extends Model {}

Post.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Title is required" },
        notEmpty: { msg: "Title cannot be empty" },
        len: { args: [2, 100], msg: "Title must be between 2 and 100 characters" },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Content is required" },
        notEmpty: { msg: "Content cannot be empty" },
      },
    },
  },
  {
    sequelize,
    modelName: "Post",
  }
);

export default Post;