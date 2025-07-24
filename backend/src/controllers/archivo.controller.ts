import { Request, Response } from "express";
import { pool } from "../config/db";

export const postArchivo = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }

    const nombre_archivo = req.file.originalname;
    const ruta_archivo = req.file.path;
    const extension = nombre_archivo.split('.').pop()?.toUpperCase() || 'DESCONOCIDO';
    const tamaño = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
    const fecha = new Date();

    const result = await pool.query(
      `INSERT INTO archivos (id_usuario, nombre_archivo, ruta_archivo, extension, tamaño, fecha_subida)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_usuario, nombre_archivo, ruta_archivo, extension, tamaño, fecha]
    );

    const nuevoArchivo = result.rows[0];

    res.status(201).json({
      id: nuevoArchivo.id_archivo,
      name: nuevoArchivo.nombre_archivo,
      type: nuevoArchivo.extension,
      size: nuevoArchivo.tamaño,
      uploadDate: nuevoArchivo.fecha_subida,
      url: `http://localhost:3000/${ruta_archivo}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir el archivo", error });
  }
};
