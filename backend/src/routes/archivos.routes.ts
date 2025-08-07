import { upload } from "../middleware/upload";
import express from 'express';
import { postArchivo, getArchivos, getArchivo, updateArchivo, deleteArchivo } from "../controllers/archivo.controller";
export const Archivorouter = express.Router();


// POST /archivos → subir archivo
Archivorouter.post("/:id", upload.single("file"), postArchivo);

// GET /archivos?id_usuario=23 → obtener todos
Archivorouter.get("/", getArchivos);

// GET /archivos/:id → obtener uno
Archivorouter.get("/:id", getArchivo);

// PUT /archivos/:id → actualizar
Archivorouter.put("/:id", updateArchivo);

// DELETE /archivos/:id → eliminar
Archivorouter.delete("/:id", deleteArchivo);