import { pool } from '../config/db';

export interface SessionPomodoro {
  id_session: number;
  id_tarea: string;
  fecha: Date;
  tiempo: number;
}

export class sessionPomodoroModel {

  static async getAll(id_usuario: number): Promise<SessionPomodoro[]> {
    const result = await pool.query('SELECT * FROM sessiones_pomodoro WHERE id_tarea IN (SELECT id_tarea FROM tareas WHERE id_usuario = $1)',[id_usuario]);
    return result.rows;
  }

  static async getAllByIdMateria(id_materia: number): Promise<SessionPomodoro[]> {
    const result = await pool.query('SELECT * FROM sessiones_pomodoro WHERE id_tarea IN (SELECT id_tarea FROM tareas WHERE id_materia = $1)',[id_materia]);
    return result.rows;
  }

  static async getByIdTarea(id_tarea: number): Promise<SessionPomodoro | null> {
    const result = await pool.query('SELECT * FROM sessiones_pomodoro WHERE id_tarea = $1', [id_tarea]);
    return result.rows[0] || null;
  }

  static async create(sessionPomodoro: Omit<SessionPomodoro, 'id_session'>): Promise<SessionPomodoro> {
    const {id_tarea, fecha, tiempo} = sessionPomodoro;

    const result = await pool.query(
      `INSERT INTO sessiones_pomodoro (id_tarea, fecha, tiempo)
      VALUES ($1, $2, $3)
       RETURNING *`,
      [id_tarea, fecha, tiempo]
    );

    return result.rows[0];
  }

  static async delete(id_session: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM sessiones_pomodoro WHERE id_session = $1', [id_session]);
    return result.rows.length > 0;
  }

}