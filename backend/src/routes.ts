import express from 'express';
import {aunthentifyUser,registerUser} from './controllers/user.controller';
import {getArchivo, postArchivo} from './controllers/archivo.controller'

export const router = express.Router();

// #################################
//    U S E R       R O U T E S
// #################################

// Log in the system
router.post("/login", aunthentifyUser);

// Create an account
router.post("/register",registerUser);


// // Route to post data {POSTS}
// router.post("/data",postData);

// router.get("/archivos", getArchivo); //aqui hay que poner el id del usuario billy tu te encargas
// //router.post("/archivos", upload.single("file"), postArchivo);

export default router;