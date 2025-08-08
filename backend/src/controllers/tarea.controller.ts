import { Request, Response } from "express";
import { Tarea, TareaModel } from "../models/tareas.models";

export const postTarea = async (req: Request, res: Response) => {
  try {

    const {titulo, descripcion, id_materia, estado, fecha_entrega} = req.body;

    const Tarea: Omit<Tarea, 'id_tarea'> = {
      id_materia: id_materia,
      titulo: titulo,
      descripcion: descripcion,
      estado: estado,
      fecha_entrega : fecha_entrega
    };

    const nuevaTarea = await TareaModel.create(Tarea);

    res.status(201).json(nuevaTarea);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la tarea.", error});
  }
};

export const getTareasPorMateria = async (req: Request, res: Response) => {
  try {

    const id_materia = parseInt(req.query.id_materia as string);

    if(isNaN(id_materia) || id_materia < 1){
      res.status(400).json({ message: "id_materia no valido."});
      return;
    }

    const Tareas = await TareaModel.getAllPorMateria(id_materia);

    res.status(200).json(Tareas);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener todas las tareas por materia.", error });
  }
}

export const getTareasPorUsuario = async (req: Request, res: Response) => {
  try {

    const id_usuario = parseInt(req.query.id_usuario as string);

    if(isNaN(id_usuario) || id_usuario < 1){
      res.status(400).json({ message: "id_usuario no valido."});
      return;
    }

    const Tareas = await TareaModel.getAll(id_usuario);

    res.status(200).json(Tareas);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener todas las tareas por usuario.", error });
  }
}

export const getTarea = async (req: Request, res: Response) => {
  try {

    const id_tarea = parseInt(req.params.id);

    if(id_tarea == null || id_tarea < 1 || id_tarea == undefined){
      res.status(500).json({ message: "id_tarea no valido."});
    }

    const Tarea = await TareaModel.getById(id_tarea);

    if (!Tarea) {
      res.status(404).json({ message: "Tarea no encontrada." });
      return;
    }

    res.status(200).json(Tarea);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener tarea.", error });
  }
}

export const updateTarea = async (req: Request, res: Response) => {
  try {
    const id_tarea = parseInt(req.params.id);

    if (!id_tarea || id_tarea < 1) {
      res.status(400).json({ message: "id_tarea no válido." });
      return;
    }

    const camposActualizables = [
      "titulo",
      "descripcion",
      "id_materia",
      "estado",
      "fecha_entrega"
    ];

    const datosActualizados: Partial<Tarea> = {};

    for (const campo of camposActualizables) {
      if (req.body[campo] !== undefined) {
        datosActualizados[campo as keyof Tarea] = req.body[campo];
      }
    }

    const tareaActualizada = await TareaModel.update(id_tarea,datosActualizados);

    if (!tareaActualizada) {
      res.status(404).json({ message: "Tarea no encontrada o sin datos para actualizar." });
      return;
    }

    res.status(200).json({
      message: "Tarea actualizada correctamente.",
      tareaActualizada
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea.", error });
  }
};

export const deleteTarea = async (req: Request, res: Response) => {
  try {
    const id_tarea = parseInt(req.params.id);

    if (!id_tarea || id_tarea < 1) {
      res.status(400).json({ message: "id_tarea no válido." });
      return;
    }

    const eliminado = await TareaModel.delete(id_tarea);

    if (!eliminado) {
      res.status(404).json({ message: "Tarea no encontrada o ya eliminada." });
      return;
    }

    res.status(200).json({ message: "Tarea eliminada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el eliminar la tarea.", error });
  }
};