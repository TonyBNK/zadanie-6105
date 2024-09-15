import cors from "cors";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routers";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", router);
app.use(errorMiddleware);

export default app;
