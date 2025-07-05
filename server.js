const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

app.get("/", (req, res) => {
  res.send("API funcionando correctamente ");
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO usuario (nombre, email, contrasena) VALUES ($1, $2, $3) RETURNING id_user, nombre, email",
      [name, email, password]
    );

    res.status(200).json({
      message: "Usuario registrado con éxito",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({
      message: "Error al registrar usuario.",
      error: error.message,
    });
  }
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    const result = await pool.query(
      "SELECT id_user, nombre, email FROM usuario WHERE email = $1 AND contrasena = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    res.status(200).json({
      message: "Bienvenido",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      message: "Error al iniciar sesión usuario.",
      error: error.message,
    });
    }
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});