import {Request, Response} from "express";
import {pool} from "../config/db";

export const getArchivo = async (request: Request, response: Response) => {
    try {
        const result = await pool.query("SELECT * FROM archivos WHERE id_usuario = $1",[]);
        response.json(result.rows);
    } catch(error){
        response.status(500).json({message: "Error obteniendo datos: ", error});
    }
}

export const postArchivo = async (request: Request, response: Response) =>  {
  try {
    const { id_usuario } = request.body;

    if (!request.file) {
      return response.status(400).json({ message: "No se envió ningún archivo" });
    }

    const ruta_archivo = request.file.path;
    const nombre_archivo = request.file.filename;

    await pool.query(
      "INSERT INTO archivo (id_usuario, nombre_archivo, ruta_archivo) VALUES ($1, $2, $3)",
      [id_usuario, nombre_archivo, ruta_archivo]
    );

    response.status(201).json({ message: "Archivo subido correctamente", archivo: nombre_archivo });
  } catch (error) {
    response.status(500).json({ message: "Error subiendo archivo", error });
  }
};