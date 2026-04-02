import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import env from "../config/env.js";

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  host: env.dbHost,
  port: env.dbPort,
  database: env.dbName,
  user: env.dbUser,
  password: env.dbPassword,
//   logging: env.nodeEnv === "development" ? console.log : false,
});

export default sequelize;