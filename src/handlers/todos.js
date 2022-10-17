import express from "express";
import { getDbHandler } from "../db/index.js";

const ToDoRequestHandler = express.Router();

ToDoRequestHandler.post("/todos", async (req, resp) => {
  try {
    // desestructuracion de parametros de la base de datos
    const { title, description } = req.body;
    // a travez de la variable tenemos acceso a la base de datos.
    const dbHandler = await getDbHandler();
    // Guarda la transaccion que se hara en la base de datos
    const newTodo = await dbHandler.run(`
    INSERT INTO todos (title, description)
    VALUES (
        '${title}',
        '${description}'
    )
    `);
    // cerra la conexion a la base de datos
    await dbHandler.close();
    // mensaje de transaccion exitosa
    resp.send({ newTodo: { title, description, ...newTodo } });
  } catch (error) {
    resp.status(500).send({
      error: `Somting went wrong when trying to create a new to do`,
    });
  }
});

ToDoRequestHandler.get("/todos", async (req, resp) => {
  try {
    //1. crear variable para acceso a la base de datos
    const dbHandler = await getDbHandler();
    //2. para la consulta a la base de datos
    const query = "SELECT * FROM todos";
    //3. obtenemos todos los datos de la tabla todos
    const getAllTodos = await dbHandler.all(query);
    //4. cerramos la conexion
    await dbHandler.close();
    // validacion en caso de no contar con datos en la tabla
    if (!getAllTodos || !getAllTodos.length) {
      //early return
      return resp.status(404).send({ message: "To Dos Not Found" });
    }

    // envio la infro por un mensaje
    resp.send({ getAllTodos });
  } catch (error) {
    resp.status(500).send({
      error: `Somting went wrong when trying to read the to do`,
    });
  }
});

ToDoRequestHandler.patch("/todos/:id", async (req, resp) => {
  try {
    //1. obtnemos los paremetros de la url
    const todoIdParam = req.params.id;
    //2. desestructuracion de parametros de la base de datos
    // isDone: es renombrar la propiedad de la tabla datos ===> is_done
    const { title, description, is_done } = req.body;
    //3. crear variable para acceso a la base de datos
    const dbHandler = await getDbHandler();
    // realizamos una cosulta
    const todoToUpdate = await dbHandler.get(
      "SELECT * FROM todos WHERE id = ? ",
      todoIdParam
    );

    // variables auxiliares
    let isDone = is_done ? 1 : 0;
    //4. para la consulta a la base de datos
    //const query = "UPDATE todos SET title = ?, description = ?, is_done = ? WHERE id = ?";
    //5. obtenemos todos los datos de la tabla todos
    await dbHandler.run(
      "UPDATE todos SET title = ?, description = ?, is_done = ? WHERE id = ?",
      title || todoToUpdate.title,
      description || todoToUpdate.description,
      isDone,
      todoIdParam
    );
    //6. cerramos la conexion
    await dbHandler.close();
    // envio la infro por un mensaje
    resp.send({
      Todo_Updated: { ...todoToUpdate, title, description, is_done },
    });
  } catch (error) {
    resp.status(500).send({
      error: `Somting went wrong when trying to read the to do`,
    });
  }
});

ToDoRequestHandler.delete("/todos/:id", async (req, resp) => {
  try {
    //1. obtnemos los paremetros de la url
    const todoIdParam = req.params.id;
    //2. crear variable para acceso a la base de datos
    const dbHandler = await getDbHandler();
    //3. para la consulta a la base de datos
    const query = "DELETE  FROM todos WHERE id = ?";
    //4. obtenemos todos los datos de la tabla todos
    const deletByIdTodos = await dbHandler.run(query, todoIdParam);
    //4. cerramos la conexion
    await dbHandler.close();
    // envio la infro por un mensaje
    resp.send({ message: { ...deletByIdTodos } });
  } catch (error) {
    resp.status(500).send({
      error: `Somting went wrong when trying to read the to do`,
    });
  }
});

export { ToDoRequestHandler };
