import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null); // Zustand für das Bearbeitungsformular

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get("http://localhost:2000/api/todos")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          console.error("Error: Response data is not an array");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const listItems = items.map((item) => (
    <li
      key={item.id}
      className="flex justify-between items-center p-2 mb-2 bg-white border rounded-lg shadow"
    >
      <span className="flex-1 text-left">{item.text}</span>
      <div className="flex space-x-2">
        <button
          onClick={() => setEditItem(item)} // Bearbeiten starten
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
      .then(() => {
        fetchTodos();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editItem && editItem.text.trim() !== "") {
      axios
        .put(`http://localhost:2000/api/todos/${editItem.id}`, {
          text: editItem.text,
        })
        .then(() => {
          setEditItem(null); // Schließen des Bearbeitungsformulars
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
        .then(() => {
          setInputValue("");
          fetchTodos();
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
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
        onKeyDown={handleKeyDown}
        className="w-96 mr-4 mb-6 p-4 border border-gray-300 rounded-lg"
      />
      <button
        className="mr-2 p-4 bg-yellow-500 text-white"
        onClick={handleAddItem}
      >
        Speichern
      </button>
      <ul>{listItems}</ul>

      {/* Bearbeitungsformular */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Eintrag bearbeiten</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editItem.text}
                onChange={(e) =>
                  setEditItem({ ...editItem, text: e.target.value })
                }
                className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-lg"
                >
                  Speichern
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem(null)} // Formular schließen
                  className="p-2 bg-gray-500 text-white rounded-lg"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
