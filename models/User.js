import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../database/db.js";

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Name is required",
        },
        notEmpty: {
          msg: "Name cannot be empty",
        },
        len: {
          args: [2, 50],
          msg: "Name must be between 2 and 50 characters",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;