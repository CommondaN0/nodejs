import User from "./User.js";
import Post from "./Post.js";

User.hasMany(Post, {
  foreignKey: {
    name: "userId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  as: "posts",
});

Post.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  as: "user",
});

export { User, Post };