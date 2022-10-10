import { initDb } from "./db/index.js";

initDb().then(() => {
  console.log("DB Created successfully");
});
