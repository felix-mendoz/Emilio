import express from 'express';
import {aunthentifyUser} from './controllers/login.controller';
import {getArchivo, postArchivo} from './controllers/archivo.controller'

export const router = express.Router();

// Route to get data {GETS}
router.post("/login", aunthentifyUser);

// // Route to post data {POSTS}
// router.post("/data",postData);

// router.get("/archivos", getArchivo); //aqui hay que poner el id del usuario billy tu te encargas
// //router.post("/archivos", upload.single("file"), postArchivo);

export default router;