import {Request, Response} from "express";
import { UserModel } from "../models/users.model";
import { User } from "../models/users.model";

export const aunthentifyUser = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            response
            .status(400)
            .json({ message: "Todos los campos son requeridos." });
        }

        const user = await UserModel.authUser(email,password);

        if (!user) {
            response.status(401).json({ message: 'Credenciales inválidas.' });
        }

        response.status(200).json({ message: 'Bienvenido', user });
        
    } catch(error){
        console.log("El error fue: ", error);
        response.status(500).json({message: "Error obteniendo datos: ", error});
    }
}

export const registerUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body;

        if (!email || !password) {
            response
            .status(400)
            .json({ message: "Todos los campos son requeridos." });
        }

        if (!name || !email || !password) {
            response.status(400).json({ message: "Todos los campos son requeridos." });
        }

        const nuevoUsuario: Omit<User, 'id_user'> = {
            nombre: name,
            email,
            contraseña: password
        };

        const user = await UserModel.create(nuevoUsuario);

        response.status(201).json({ message: "Usuario registrado", user });
        
    } catch(error){
        console.log("El error fue: ", error);
        response.status(500).json({message: "Error obteniendo datos: ", error});
    }
}
