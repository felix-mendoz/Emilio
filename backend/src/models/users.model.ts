import { pool } from '../config/db';

export interface User {
  id_user: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: string;
  email?: string;
  fecha_de_nacimiento?: Date;
  lugar_donde_naciste?: string;
  sexo?: string;
  genero?: string;
  nacionalidad?: string;
  carrera?: string;
  estado?: boolean;
  contraseña?: string;
}

export class UserModel {
  static async getAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM usuario');
    return result.rows;
  }

  static async getById(id: number): Promise<User | null> {
    const result = await pool.query('SELECT * FROM usuario WHERE id_user = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(usuario: Omit<User, 'id_user'>): Promise<User> {
    const { nombre, email, contraseña } = usuario;

    const result = await pool.query(
      `INSERT INTO usuario (nombre, email, contrasena)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nombre, email, contraseña]
    );

    return result.rows[0];
  }

  static async update(id: number, datos: Partial<User>): Promise<User | null> {
    const campos = [];
    const valores: any[] = [];
    let i = 1;

    for (const [clave, valor] of Object.entries(datos)) {
      campos.push(`${clave} = $${i++}`);
      valores.push(valor);
    }

    if (campos.length === 0) return null;

    valores.push(id);
    const query = `UPDATE usuario SET ${campos.join(', ')} WHERE id_user = $${i} RETURNING *`;

    const result = await pool.query(query, valores);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
    return result.rows.length > 0;
  }

  static async authUser (email: string, contrasena: string): Promise <User | null> {
    const result = await pool.query(
      'SELECT id_user, nombre, email FROM usuario WHERE email = $1 AND contrasena = $2',
      [email, contrasena]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

}