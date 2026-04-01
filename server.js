import express from "express";
import indexRouter from "./routes/index.js"
import logger from "./middleware/logger.js"
import { sequelize } from "./database/db.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use("/api", indexRouter)

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function start() {
    try {
      await sequelize.authenticate();
      console.log("PostgreSQL connected");

      await sequelize.sync();
      console.log("Tables synced");

      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to start:", error);
    } 
}

start();