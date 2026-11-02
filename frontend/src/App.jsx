import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState ("");

  const load = async () => {
    const res = await fetch(`${API}/api/tasks`);
    setTasks(await res.json());
  };

  useEffect(() => { load(); }, []);

  //agrega una tarea nueva y la manda al backend
  const addTask = async (e) => {
    e.preventDefault();
    //si el campo esta vacio muestra el error y no envia nada
    if (!title.trim()) {
      setFormError("Escribe el titulo antes de agregar la tarea")
      return;
    }
    
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

  //recibe la trarea completada, se necesita saber 
  // si esta hecha o aun no, !si done esta false manda a su contrario
  const toggleTask = async (task) => {
    await fetch (`${API}/api/tasks/${task.id}`,{
      method: "PATCH",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done })
    });
    load();  
  };
  

  return (
    <main>
      <h1>TaskBoard</h1>
      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setFormError(""); }}
          placeholder="Escribe una nueva tarea..."
        />
        <button>Agregar</button>  
      </form>
       {formError && <p style={{ color: "red"}}>{formError}</p>}
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