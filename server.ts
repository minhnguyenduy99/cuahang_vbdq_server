import "module-alias/register";
import App from "./src/app";


(async function startServer() {

  console.log(`MODE: ${process.env.MODE}`);

  const app = new App(process.env.SETTING_FILE);
  app.initialize();
  app.start();

})();


