import Express from "express";
import { initDb } from "./db/index.js";

const Api = Express();

// middleware para convertir a formato Jason.
Api.use(Express.json());
// middleware para proteger la  url
Api.use(Express.urlencoded({ extended: false }));

Api.listen(3000, () => {
  console.log("API IS RUNNING :)\n");
  initDb().then(() => {
    console.log("DB Created successfully:)");
  });
});
