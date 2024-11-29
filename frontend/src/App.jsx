import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit"; // Importieren des Stift-Icons
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get("http://localhost:2000/api/todos")
      .then((response) => {
        if (Array.isArray(response.data)) {
          {
            console.log(response.data);
          }
          setItems(response.data);
        } else {
          console.error("Error: Response data is not an array");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const listItems = items.map((item) => (
    <li
      key={item.id}
      className="flex justify-between items-center p-2 mb-2 bg-white border rounded-lg shadow"
    >
      <span className="flex-1 text-left">{item.text}</span>
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditItem(item.id, item.text)}
          className="ml-2 p-2 bg-gray-500 text-white rounded-lg"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => handleDeleteItem(item.id)}
          className="p-2 bg-red-500 text-white rounded-lg"
        >
          <DeleteIcon />
        </button>
      </div>
    </li>
  ));

  const handleDeleteItem = (id) => {
    axios
      .delete(`http://localhost:2000/api/todos/${id}`)
      .then((response) => {
        if (Array.isArray(response.data.todos)) {
          setItems(response.data.todos);
        } else {
          console.error("Error: Response data is not an array");
        }
        fetchTodos();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleEditItem = (id, text) => {
    const updatedText = prompt("Geben Sie den neuen Text ein", text);
    if (updatedText !== null) {
      axios
        .put(`http://localhost:2000/api/todos/${id}`, { text: updatedText })
        .then((response) => {
          if (Array.isArray(response.data.todos)) {
            setItems(response.data.todos);
          } else {
            console.error("Error: Response data is not an array");
          }
          fetchTodos();
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      const newTodo = { id: uuidv4(), text: inputValue };
      axios
        .post("http://localhost:2000/api/todos", newTodo)
        .then((response) => {
          if (Array.isArray(response.data.todos)) {
            setItems(response.data.todos);
          } else {
            console.error("Error: Response data is not an array");
          }
          setInputValue("");
          fetchTodos();
        })
        .catch((error) => console.error("Error:", error));
    }
  };
  return (
    <>
      <h1 className="text-6xl mb-10 font-bold mb-4">ToDo Liste</h1>
      <input
        type="text"
        placeholder="Geben Sie hier Ihr ToDo ein"
        value={inputValue}
        onChange={handleChange}
        className="w-96 mr-4 mb-6 p-4 border border-gray-300 rounded-lg"
      />
      <button
        className="mr-2 p-4 bg-yellow-500 text-white"
        onClick={handleAddItem}
      >
        Speichern
      </button>
      <ol>{listItems}</ol>
    </>
  );
}

export default App;
