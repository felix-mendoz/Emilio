import { Request, Response } from "express";
import { SessionPomodoro, sessionPomodoroModel } from "../models/sessionespomodoro.models";

export const postSession = async (req: Request, res: Response) => {
  try {

    const {id_tarea, tiempo} = req.body;

    if (id_tarea == undefined || id_tarea == null){
        res.status(400).json({message: "No se recibió el id de la tarea."});
        return;
    }

    if (tiempo == undefined || tiempo == null){
        res.status(400).json({message: "No se recibió el tiempo de la session."});
        return;
    }

    const fecha = new Date();

    const SessionPomodoro: Omit<SessionPomodoro, 'id_session'> = {
      id_tarea : id_tarea,
      tiempo : tiempo,
      fecha : fecha
    };

    const nuevaSessionPomodoro = await sessionPomodoroModel.create(SessionPomodoro);

    res.status(201).json(nuevaSessionPomodoro);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la session.", error});
  }
};

export const getSessionesTodas = async (req: Request, res: Response) => {
  try {

    const id_usuario = parseInt(req.params.id);

    if(isNaN(id_usuario) || id_usuario < 1){
      res.status(400).json({ message: "el id no es valido."});
      return;
    }

    const SessionesPomodoros = await sessionPomodoroModel.getAll(id_usuario);

    res.status(200).json(SessionesPomodoros);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener todas las sessiones pomodoro del usuario.", error });
  }
}

export const getSessionesTodasPorMateria = async (req: Request, res: Response) => {
  try {

    const id_materia = parseInt(req.params.id);

    if(isNaN(id_materia) || id_materia < 1){
      res.status(400).json({ message: "el id no es valido."});
      return;
    }

    const SessionesPomodoros = await sessionPomodoroModel.getAllByIdMateria(id_materia);

    res.status(200).json(SessionesPomodoros);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener todas las sessiones pomodoro de la mateia.", error });
  }
}

export const getSessionesTodasPorTarea = async (req: Request, res: Response) => {
  try {

    const id_tarea = parseInt(req.params.id);

    if(isNaN(id_tarea) || id_tarea < 1){
      res.status(400).json({ message: "el id no es valido."});
      return;
    }

    const SessionesPomodoros = await sessionPomodoroModel.getByIdTarea(id_tarea);

    res.status(200).json(SessionesPomodoros);

  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Error al obtener todas las sessiones pomodoro por tarea.", error });
  }
}

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const id_session = parseInt(req.params.id);

    if (!id_session || id_session < 1) {
      res.status(400).json({ message: "id_tarea no válido." });
      return;
    }

    const eliminado = await sessionPomodoroModel.delete(id_session);

    if (!eliminado) {
      res.status(404).json({ message: "Session no encontrada o ya eliminada." });
      return;
    }

    res.status(200).json({ message: "Session eliminada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la session.", error });
  }
};