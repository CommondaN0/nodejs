import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres"

export const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: "postgres",
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432
});