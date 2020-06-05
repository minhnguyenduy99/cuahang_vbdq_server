import "module-alias/register";
import App from "./src/app";


(async function startServer() {

  const host = process.env.HOST || "0.0.0.0";
  const port = parseInt(process.env.PORT, 10) || 3000;

  const app = new App();

  try {
    await app.startService();
  } catch (err) {
    console.log(err);
  }
  app.listen(host, port);

})();


