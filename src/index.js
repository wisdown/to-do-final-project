import Express from "express";
import { initDb } from "./db/index.js";
import { ToDoRequestHandler } from "./handlers/todos.js";

const Api = Express();

// middleware para convertir a formato Jason.
Api.use(Express.json());
// middleware para proteger la  url
Api.use(Express.urlencoded({ extended: false }));

// utilizar
Api.use("/todo", ToDoRequestHandler);

// para fines de prueba
Api.get("/test", (request, res) => {
  res.send({ message: "your are in." });
});

Api.listen(3000, () => {
  console.log("API IS RUNNING :)\n");
  initDb().then(() => {
    console.log("DB Created successfully:)");
  });
});
