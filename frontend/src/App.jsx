import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState ("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   // trae las tareas del backend, si falla muestra un mensaje de error
  const load = async () => {
    setError("");
    try {
     const res = await fetch(`${API}/api/tasks`);
     setTasks (await res.json());
    } catch{
            setError("No se pudo conectar con el servidor, por favor intenta nuevamente");
    }
    setLoading(false);
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
    <main className="app">
      <h1 className="title">TaskBoard</h1>
      <p className="subtitle">Organiza tu día, una tarea a la vez.</p>

      <form onSubmit={addTask} className="task-form">
        <input
          className={formError ? "input input-error" : "input"}
          value={title}
          onChange={(e) => { setTitle(e.target.value); setFormError(""); }}
          placeholder="Escribe una nueva tarea..."
        />
        <button className="btn">Agregar</button>
      </form>

      {formError && <p className="msg msg-error">{formError}</p>}
      {loading && <p className="msg">Cargando tareas... el servidor puede tardar un minuto.</p>}
      {error && <p className="msg msg-error">{error}</p>}

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? "task done" : "task"}>
            <input type="checkbox" checked={t.done} onChange={() => toggleTask(t)} />
            <span className="task-title">{t.title}</span>
            <button className="btn-delete" onClick={() => deleteTask(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </main>
  );
}