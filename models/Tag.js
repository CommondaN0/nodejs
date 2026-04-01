import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../database/db.js";

class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
  }
);

export default Tag;