import "module-alias/register";
import dotenv from "dotenv";
import App from "./src/app";


(async function startServer() {

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


