import "module-alias/register";
import dotenv from "dotenv";
import App from "./src/app";


(async function startServer() {

  dotenv.config();
  console.log(`MODE: ${process.env.MODE}`);

  const app = new App(process.env.MODE);
  app.start();

})();


