import express from 'express';
import { postSession, getSessionesTodas, getSessionesTodasPorMateria, getSessionesTodasPorTarea, deleteSession } from '../controllers/sessionpomodoro.controller';

export const SessionesRouter = express.Router();

// POST /session →  guardar session
SessionesRouter.post("/", postSession);

// GET /sesssion → obtener todos
SessionesRouter.get("/:id", getSessionesTodas);

// GET /session → obtener todos por materia
SessionesRouter.get("/por-materia/:id", getSessionesTodasPorMateria);

// GET /tarea/:id → obtener todos por tarea
SessionesRouter.get("/por-tarea/:id", getSessionesTodasPorTarea);

// DELETE /tarea/:id → eliminar session
SessionesRouter.delete("/:id", deleteSession);