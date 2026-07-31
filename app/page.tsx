"use client";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("ERROR FETCHING:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!name) return;
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    fetchItems();
  };
  const updateItem = async () => {
    if (!name || editId === null) return;
    await fetch(`/api/items/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    setEditId(null);
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const startEdit = (item: Item) => {
    setName(item.name);
    setEditId(item.id);
  };

 return (
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
      Welcome To Student Information
    </h1>
    <div className="flex justify-center mb-6">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Name..."
        className="border border-gray-300 p-2 text-black rounded-l-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {editId ? (
        <button
          onClick={updateItem}
          className="bg-indigo-400 hover:bg-indigo-600 text-white px-4 rounded-r-md"
        >
          Update
        </button>
      ) : (
        <button
          onClick={addItem}
          className="bg-amber-500 hover:bg-amber-600 text-black px-4 rounded-r-md"
        >
          Add
        </button>
      )}
    </div>

    <div className=" mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-black">
          {items.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No students found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-indigo-400 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}