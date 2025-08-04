import express from 'express';
import { Archivorouter } from './routes/archivos.routes';
import { Userrouter } from './routes/users.routes';
export const router = express.Router();

// #################################
//    U S E R       R O U T E S
// #################################

// rutas para los usuarios
router.use("/usuario", Userrouter);

// rutas para los archivos
router.use("/archivo",Archivorouter);

export default router;