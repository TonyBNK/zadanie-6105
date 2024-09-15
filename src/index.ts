import dotenv from "dotenv";
import sequilize from "./db";
import app from "./settings";

dotenv.config();

const SERVER_ADDRESS = process.env.SERVER_ADDRESS || "http://localhost:8080";

const { hostname, port } = new URL(SERVER_ADDRESS);

async function startApplication() {
  try {
    await sequilize.authenticate();
    await sequilize.sync();

    app.listen(+port, hostname, () =>
      console.log(`Application listening on port ${port}`)
    );
  } catch (error) {
    console.log("Error while starting: ", error);
  }
}

startApplication();
