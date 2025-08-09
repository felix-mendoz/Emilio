import { pool } from '../config/db';

export interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  id_materia?: number;
  estado?: boolean;
  fecha_entrega?: Date;
  tiempo_dedicado?: number;
  fecha_ultima_session?: Date;
  id_usuario?: number;
}

export class TareaModel {
  static async getAllPorMateria(id_materia: number): Promise<Tarea[]> {
    const result = await pool.query('SELECT * FROM tareas WHERE id_materia = $1',[id_materia]);
    return result.rows;
  }

  static async getAll(id_usuario: number): Promise<Tarea[]> {
    const result = await pool.query('SELECT * FROM tareas WHERE id_usuario = $1',[id_usuario]);
    return result.rows;
  }

  static async getById(id_tarea: number): Promise<Tarea | null> {
    const result = await pool.query('SELECT * FROM tareas WHERE id_tarea = $1', [id_tarea]);
    return result.rows[0] || null;
  }

  static async create(tarea: Omit<Tarea, 'id_tarea'>): Promise<Tarea> {
    const {titulo, descripcion, id_materia, estado, fecha_entrega, id_usuario} = tarea;

    const result = await pool.query(
      `INSERT INTO tareas (titulo, descripcion, id_materia, estado, fecha_entrega, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [titulo, descripcion, id_materia, estado, fecha_entrega, id_usuario]
    );

    return result.rows[0];
  }

  static async update(id_tarea: number, datos: Partial<Tarea>): Promise<Tarea | null> {
    const campos = [];
    const valores: any[] = [];
    let i = 1;

    for (const [clave, valor] of Object.entries(datos)) {
      campos.push(`${clave} = $${i++}`);
      valores.push(valor);
    }

    if (campos.length === 0) return null;

    valores.push(id_tarea);
    const query = `UPDATE tareas SET ${campos.join(', ')} WHERE id_tarea = $${i} RETURNING *`;

    const result = await pool.query(query, valores);
    return result.rows[0] || null;
  }

  static async delete(id_tarea: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tareas WHERE id_tarea = $1', [id_tarea]);
    return true;
  }

}