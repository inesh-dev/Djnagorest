import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/grocery";

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        toast.error("Could not load grocery list");
      }
    };
    fetchItems();
  }, []);

  const addItem = async (name) => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, completed: false }),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem.data]);
      setItemName("");
      toast.success("Grocery item added");
    } catch {
      toast.error("Could not add item");
    }
  };

  const editCompleted = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/${itemId}/toggle/`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updated.data : item)),
      );
    } catch {
      toast.error("Could not update item");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`${BASE_URL}/${itemId}/`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item deleted");
    } catch {
      toast.error("Could not delete item");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
  };

  const updateItemName = async (newName) => {
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/${editId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === editId ? updated.data : item)),
      );
      setEditId(null);
      setEditName("");
      toast.success("Item updated");
    } catch {
      toast.error("Could not update item");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateItemName(editName);
    } else {
      addItem(itemName);
    }
  };

  return (
    <div className="app">
      <h1>Grocery Bud</h1>
      <form onSubmit={handleSubmit} className="grocery-form">
        <input
          type="text"
          placeholder="e.g. milk"
          value={editId ? editName : itemName}
          onChange={(e) =>
            editId ? setEditName(e.target.value) : setItemName(e.target.value)
          }
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <ul className="grocery-list">
        {items.map((item) => (
          <li key={item.id} className={item.completed ? "completed" : ""}>
            <span onClick={() => editCompleted(item.id)}>{item.name}</span>
            <div className="actions">
              <button type="button" onClick={() => startEdit(item)}>
                Edit
              </button>
              <button type="button" onClick={() => removeItem(item.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p>No items yet.</p>}
      </ul>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
