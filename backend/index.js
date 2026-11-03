const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/tasks", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id");
  res.json(rows);
});

app.post("/api/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "El título es obligatorio" });
  const { rows } = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *", [title]);
  res.status(201).json(rows[0]);
});

//cambia una tarea entre completada o pendiente 
app.patch("/api/tasks/:id", async (req, res) =>{
  const {done } = req.body;
  const { rows } = await pool.query(
    "UPDATE tasks SET done = $1 WHERE id = $2 RETURNING *", [done, req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Tarea no encontrada"});
  res.json(rows[0]);
});

//Elimina una tarea
app.delete("/api/tasks/:id", async (req, res) =>{
  const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: "Tarea no encontrada" });
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));