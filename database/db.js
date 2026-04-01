import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres"

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: "postgres",
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432
});

export default sequelize;