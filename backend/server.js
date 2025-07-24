const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
});

// Configurar carpeta temporal
const tempDir = path.join(__dirname, "..", "uploads", "temp");
fs.mkdirSync(tempDir, { recursive: true });

// Configurar multer para guardar archivos en carpeta temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

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
    console.error("Error al registrar:", error.code);
    if( error.code === '23505' ) {
      return res.status(500).json({ message: "El email ya está registrado." });
    }
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

app.get("/api/documents", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM archivo");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo datos: ", error });
  }
});

app.delete("/api/documents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM archivo WHERE id_archivo = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Documento no encontrado." });
    }

    res.json({ message: "Documento eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando documento: ", error });
  }
});

app.put("/api/documents/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_archivo, extension, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE archivo 
       SET nombre_archivo = $1, extension = $2, estado = $3, ultima_revision = NOW() 
       WHERE id_archivo = $4`,
      [nombre_archivo, extension, estado, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Documento no encontrado." });
    }

    res.json({ message: "Documento actualizado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error actualizando documento: ", error });
  }
});

// Guardar un documento
app.post(
  "/api/documents",
  upload.single("guarda_archivo"),
  async (req, res) => {
    try {
      console.log("Llegó una solicitud de subida de archivo");
      const { nombre_archivo, extension, id_usuario } = req.body;
      const estado = true;
      const ultima_revision = new Date();
      const fecha_subida = new Date();
      // const guarda_archivo = req.file.filename; // o usa newFileName si ya lo renombraste
      // console.log("a",guarda_archivo);
      console.log("Archivo recibido:", req.file);
      console.log("Body recibido:", req.body);

      if (!req.file) {
        return res.status(400).json({ message: "Archivo no recibido" });
      }

      // Crear carpeta para el usuario si no existe
      const userDir = path.join(__dirname, "uploads", id_usuario);
      fs.mkdirSync(userDir, { recursive: true });

      // Definir nueva ruta del archivo
      const newFileName = `${Date.now()}-${req.file.originalname}`;
      const finalPath = path.join(userDir, newFileName);

      // Mover el archivo desde carpeta temporal
      fs.renameSync(req.file.path, finalPath);

      // Ruta relativa para guardar en la DB (opcional)
      const ruta_archivo = path.join("uploads", id_usuario, newFileName);

      await pool.query(
        `INSERT INTO archivo 
      (nombre_archivo, guarda_archivo, extension, estado, ultima_revision, fecha_subida, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          nombre_archivo,
          ruta_archivo,
          extension,
          estado,
          ultima_revision,
          fecha_subida,
          parseInt(id_usuario),
        ]
      );

      res.status(201).json({
        message: "Archivo subido y registrado correctamente",
        archivo: {
          nombre_archivo,
          guarda_archivo: ruta_archivo,
          extension,
          estado,
          ultima_revision,
          fecha_subida,
          id_usuario,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error insertando archivo",
        error: error.message || error,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
