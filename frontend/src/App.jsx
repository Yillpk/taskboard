import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await fetch(`${API}/api/tasks`);
    setTasks(await res.json());
  };

  useEffect(() => { load(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    setTitle("");
    load();
  };

  return (
    <main>
      <h1>TaskBoard</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button>Agregar</button>
      </form>
      <ul>{tasks.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
    </main>
  );
}