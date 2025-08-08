import express from 'express';
import {aunthentifyUser,registerUser} from '../controllers/user.controller';

export const Userrouter = express.Router();

// para autentificar
Userrouter.post("/login", aunthentifyUser);

// para registrarse
Userrouter.post("/register",registerUser);