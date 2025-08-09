import express from 'express';
import { postTarea, getTareasPorMateria, getTareasPorUsuario, getTarea, updateTarea, deleteTarea} from '../controllers/tarea.controller';
export const Tarearouter = express.Router();

// POST /tarea →  guardar tarea
Tarearouter.post("/", postTarea);

// GET /tarea?id_materia=23 → obtener todos por materia
Tarearouter.get("/por-materia", getTareasPorMateria);

// GET /tarea?id_usuario=23 → obtener todos por usuario
Tarearouter.get("/por-usuario/:id", getTareasPorUsuario);

// GET /tarea/:id → obtener uno
Tarearouter.get("/:id", getTarea);

// PUT /tarea/:id → actualizar
Tarearouter.put("/:id", updateTarea);

// DELETE /tarea/:id → eliminar
Tarearouter.delete("/:id", deleteTarea);