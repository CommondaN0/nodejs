import env from "./config/env.js";
import app from "./app.js";
import sequelize from "./database/db.js";
import "./models/User.js";
import "./models/Post.js";
import "./models/Tag.js";
import "./models/RefreshToken.js";
import "./models/associations.js";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();
    app.listen(env.port, () => {
      console.log(`Server started on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();