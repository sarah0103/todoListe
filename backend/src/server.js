const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 2000;

let todos = [];
app.use(bodyParser.json());
app.use(cors());

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const newTodo = req.body;
  if (newTodo) {
    todos.push(newTodo);
    res.status(201).json({ message: "Todo hinzugefügt", todos });
  } else {
    res.status(400).json({ message: "Todo ist erforderlich" });
  }
});

app.put("/api/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const updatedText = req.body.text;

  const todo = todos.find((t) => t.id === todoId);
  if (todo) {
    todo.text = updatedText;
    res.status(200).json({ message: "Todo aktualisiert", todos });
  } else {
    res.status(404).json({ message: "Todo nicht gefunden" });
  }
});

app.delete("/api/todos/:id", (req, res) => {
  const todoId = req.params.id;
  todos = todos.filter((t) => t.id !== todoId);
  res.status(200).json({ message: "Todo gelöscht", todos });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
