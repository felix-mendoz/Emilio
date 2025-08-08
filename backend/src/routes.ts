import express from 'express';
import { Archivorouter } from './routes/archivos.routes';
import { Userrouter } from './routes/users.routes';
import { Tarearouter } from './routes/tareas.routes';
import { SessionesRouter } from './routes/sessionesPomodoros.routes';

export const router = express.Router();

// #################################
//    U S E R       R O U T E S
// #################################

// rutas para los usuarios
router.use("/usuario", Userrouter);

// rutas para los archivos
router.use("/archivo",Archivorouter);

//rutas para las tareas
router.use("/tarea", Tarearouter);

//rutas para las sessiones
router.use("/session",SessionesRouter);

export default router;