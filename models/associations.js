import User from "./User.js";
import Post from "./Post.js";
import Tag from "./Tag.js";

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

Post.belongsToMany(Tag, {
  through: "PostTags",
  as: "tags",
});

Tag.belongsToMany(Post, {
  through: "PostTags",
  as: "posts",
});

export { User, Post, Tag };