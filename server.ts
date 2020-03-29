import "module-alias/register";
import App from "./src/app";
import dotenv from "dotenv";


(async function startServer() {
// accept enviroment variables configuration
  dotenv.config();

  const host = process.env.HOST || "localhost";
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = new App();

  try {
    await app.startService();
  } catch (err) {
    console.log(err);
  }
  app.listen(host, port);

})();


