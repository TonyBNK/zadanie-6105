import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export default new Sequelize(
  process.env.POSTGRES_DATABASE || "",
  process.env.POSTGRES_USERNAME || "",
  process.env.POSTGRES_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
  }
);
