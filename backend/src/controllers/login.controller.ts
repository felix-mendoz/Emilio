import {Request, Response} from "express";
import { UserModel } from "../models/users.model";

// Controller to get data
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
        response.status(500).json({message: "Error obteniendo datos: ", error});
    }
}
