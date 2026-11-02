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

  //Borra una tarea usando su id, y con load se actualiza
  const deleteTask = async (id) => {
    await fetch(`${API}/api/tasks/${id}`, {method: "DELETE" });
    load();
  };

  //recibe la ttarea completada, se necesita saber 
  // si esta hecha o aun no, !si done esta flase manda a su contrario
  const toggleTask = async (task) => {
    await fetch (`${API}/api/tasks/${task.id}`,{
      method: "PATCH",
      headers: {"Content-Type": "aplication/json" },
      body: JSON.stringify({ done: !task.done })
    });
    load();  
  };
  

  return (
    <main>
      <h1>TaskBoard</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button>Agregar</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
            {t.title}
            <button onClick={() => deleteTask(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      
    </main>
  );
}