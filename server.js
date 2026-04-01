import app from "./app.js";
import sequelize from "./database/db.js";
import "./models/User.js";
import "./models/Post.js";
import "./models/associations.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();
    console.log("Models synchronized");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

start();