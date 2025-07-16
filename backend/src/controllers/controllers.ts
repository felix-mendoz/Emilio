import {Request, Response} from "express";
import {pool} from "../config/db";

// Controller to get date
export const getData = async (request: Request, response: Response) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        response.json(result.rows);
    } catch(error){
        response.status(500).json({message: "Error obteniendo datos: ", error});
    }
}

export const getDataArchivos = async (request: Request, response: Response) => {
    try {
        const result = await pool.query("SELECT * FROM archivos");
        response.json(result.rows);
    } catch(error){
        response.status(500).json({message: "Error obteniendo datos: ", error});
    }
}

export const postDataArchivos = async (request: Request, response: Response) => {
    try {
        const {nombre, tipo, tamano} = request.body;
        await pool.query("INSERT INTO archivos (nombre, tipo, tamano) VALUES ($1, $2, $3)", [nombre, tipo, tamano]);
        response.json({message: "Archivo insertado correctamente"});
    } catch(error) {
        response.status(500).json({message: "Error insertando archivo", error});
    }
}
// Controller to insert data
export const postData = async (request: Request, response: Response) => {
    try {
        const {nombre, correo} = request.body;
        await pool.query("INSERT INTO usuarios (usuarios, email) VALUES ($1, $2)", [nombre,correo]);
        response.json({message: "Datos insertados correctamente"})
    } catch(error){
        response.status(500).json({message:"Error insertando datos", error});
    }
}
