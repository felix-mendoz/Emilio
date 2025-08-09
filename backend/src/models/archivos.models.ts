import { pool } from '../config/db';

export interface Archivo {
  id_usuario: number;
  nombre_archivo?: string;
  extension?: string;
  fecha_subida?: Date;
  estado?: boolean;
  ultima_revision?: Date | null;
  ruta_archivo?: string;
  id_archivo: number;
  tamaño?: number;
}

export class ArchivoModel {
  static async getAll(id_usuario: number): Promise<Archivo[]> {
    const result = await pool.query('SELECT * FROM archivo WHERE id_usuario = $1',[id_usuario]);
    return result.rows;
  }

  static async getById(id_archivo: number): Promise<Archivo | null> {
    const result = await pool.query('SELECT * FROM archivo WHERE id_archivo = $1', [id_archivo]);
    return result.rows[0] || null;
  }

  static async create(archivo: Omit<Archivo, 'id_archivo'>): Promise<Archivo> {
    const { id_usuario, nombre_archivo, extension, fecha_subida, estado, ultima_revision, ruta_archivo, tamaño} = archivo;

    const result = await pool.query(
      `INSERT INTO archivo (id_usuario, nombre_archivo, extension, fecha_subida, estado, ultima_revision, ruta_archivo, tamaño)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id_usuario, nombre_archivo, extension, fecha_subida, estado, ultima_revision, ruta_archivo, tamaño]
    );

    return result.rows[0];
  }

  static async update(id_archivo: number, datos: Partial<Archivo>): Promise<Archivo | null> {
    const campos = [];
    const valores: any[] = [];
    let i = 1;

    for (const [clave, valor] of Object.entries(datos)) {
      campos.push(`${clave} = $${i++}`);
      valores.push(valor);
    }

    if (campos.length === 0) return null;

    valores.push(id_archivo);
    const query = `UPDATE archivo SET ${campos.join(', ')} WHERE id_archivo = $${i} RETURNING *`;

    const result = await pool.query(query, valores);
    return result.rows[0] || null;
  }

  static async delete(id_archivo: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM archivo WHERE id_archivo = $1', [id_archivo]);
    return true;
  }

}