import { Request, Response } from "express";
import {Archivo, ArchivoModel} from "../models/archivos.models";

export const postArchivo = async (req: Request, res: Response) => {
  try {

    const { id_usuario } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "No se recibió ningún archivo" });
      return;
    }

    const nombre_archivo = req.file.originalname;
    const ruta_archivo = req.file.path;
    const extension = nombre_archivo.split('.').pop()?.toUpperCase() || 'DESCONOCIDO';
    const tamaño = req.file.size;
    const fecha = new Date();

    const RecibidoArchivo: Omit<Archivo, 'id_archivo'> = {
      id_usuario: id_usuario,
      nombre_archivo: nombre_archivo,
      extension: extension,
      fecha_subida: fecha,
      estado:true,
      ultima_revision: null,
      ruta_archivo: ruta_archivo,
      tamaño : tamaño
    };

    const nuevoArchivo = await ArchivoModel.create(RecibidoArchivo);

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
    res.status(500).json({ message: "Error al subir el archivo", error});
  }
};

export const getArchivos = async (req: Request, res: Response) => {
  try {

    const id_usuario = parseInt(req.query.id_usuario as string);

    if(isNaN(id_usuario) || id_usuario < 1){
      res.status(400).json({ message: "id_usuario no valido."});
      return;
    }

    const Archivos = await ArchivoModel.getAll(id_usuario);

    const ArchivosFormateados = Archivos.map(Archivo => ({
      id_archivo: Archivo.id_archivo,
      nombre_archico: Archivo.nombre_archivo,
      extension: Archivo.extension,
      tamaño: Archivo.tamaño,
      fecha_subida: Archivo.fecha_subida,
      url: `http://localhost:3000/${Archivo.ruta_archivo}`
    }));

    res.status(200).json(ArchivosFormateados);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener archivos", error });
  }
}

export const getArchivo = async (req: Request, res: Response) => {
  try {

    const id_archivo = parseInt(req.params.id);

    if(id_archivo == null || id_archivo < 1 || id_archivo == undefined){
      res.status(500).json({ message: "id_usuario no valido."});
    }

    const Archivo = await ArchivoModel.getById(id_archivo);

    if (!Archivo) {
      res.status(404).json({ message: "Archivo no encontrado" });
      return;
    }

    const ArchivoFormateado = {
      id_archivo: Archivo.id_archivo,
      nombre_archico: Archivo.nombre_archivo,
      extension: Archivo.extension,
      tamaño: Archivo.tamaño,
      fecha_subida: Archivo.fecha_subida,
      url: `http://localhost:3000/${Archivo.ruta_archivo}`
    };

    res.status(200).json(ArchivoFormateado);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener archivos", error });
  }
}

export const updateArchivo = async (req: Request, res: Response) => {
  try {
    const id_archivo = parseInt(req.params.id);

    if (!id_archivo || id_archivo < 1) {
      res.status(400).json({ message: "id_archivo no válido." });
      return;
    }

    const camposActualizables = [
      "nombre_archivo",
      "extension",
      "fecha_subida",
      "estado",
      "ultima_revision",
      "ruta_archivo",
      "tamaño"
    ];

    const datosActualizados: Partial<Archivo> = {};

    for (const campo of camposActualizables) {
      if (req.body[campo] !== undefined) {
        datosActualizados[campo as keyof Archivo] = req.body[campo];
      }
    }

    const archivoActualizado = await ArchivoModel.update(id_archivo, datosActualizados);

    if (!archivoActualizado) {
      res.status(404).json({ message: "Archivo no encontrado o sin datos para actualizar" });
      return;
    }

    res.status(200).json({
      message: "Archivo actualizado correctamente",
      archivo: {
        id_archivo: archivoActualizado.id_archivo,
        nombre_archivo: archivoActualizado.nombre_archivo,
        extension: archivoActualizado.extension,
        tamaño: archivoActualizado.tamaño,
        fecha_subida: archivoActualizado.fecha_subida,
        url: `http://localhost:3000/${archivoActualizado.ruta_archivo}`
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el archivo", error });
  }
};

export const deleteArchivo = async (req: Request, res: Response) => {
  try {
    const id_archivo = parseInt(req.params.id);

    if (!id_archivo || id_archivo < 1) {
      res.status(400).json({ message: "id_archivo no válido." });
      return;
    }

    const eliminado = await ArchivoModel.delete(id_archivo);

    if (!eliminado) {
      res.status(404).json({ message: "Archivo no encontrado o ya eliminado" });
      return;
    }

    res.status(200).json({ message: "Archivo eliminado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el archivo", error });
  }
};