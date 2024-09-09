import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { broadcast } from '../index.js';


export const createUser = async (req, res, next) => {
  try {
    const { id_rol, nombre_usuario, clave_usuario } = req.body;

    // Hash de la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(clave_usuario, 10);

    const newUser = await db.query(
      `INSERT INTO usuario (id_rol, nombre_usuario, clave_usuario) VALUES($1, $2, $3) RETURNING *`,
      [id_rol, nombre_usuario, hashedPassword]
    );

    // Enviar actualización a todos los clientes conectados
    broadcast({ type: 'NEW_USER', payload: newUser.rows[0] });

    res.json(newUser.rows[0]);
  } catch (error) {
    next(error);
  }
};



export const countUsers = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM usuario`);
  return parseInt(result.rows[0].count);
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM usuario WHERE id_usuario = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_rol, nombre_usuario, clave_usuario } = req.body;

    const result = await db.query(
      `UPDATE usuario SET id_rol = $1, nombre_usuario = $2, clave_usuario = $3 WHERE id_usuario = $4 RETURNING *`,
      [id_rol, nombre_usuario, clave_usuario, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM usuario WHERE id_usuario = $1`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'User not found' });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const { nombre_usuario, clave_usuario } = req.body;

    // Buscar el usuario en la base de datos por nombre de usuario
    const result = await db.query(
      `SELECT * FROM usuario WHERE nombre_usuario = $1`,
      [nombre_usuario]
    );

    // Si no se encuentra el usuario
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña utilizando bcrypt
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(clave_usuario, user.clave_usuario);

    // Si la contraseña no es válida
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar un token JWT con el ID del usuario, el tipo de usuario y la clave secreta
    const token = jwt.sign(
      { id: user.id_usuario, tipo_usuario: user.id_rol },
      'your-secret-key'
    );

    // Devolver el token, el ID del usuario y el tipo de usuario
    res.status(200).json({
      token,
      usuarioId: user.id_usuario,
      tipoUsuario: user.id_rol
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const countUsuarios = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM "usuario"`);
  return parseInt(result.rows[0].count, 10);
};

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await db.query(`SELECT * FROM "usuario"`);
    const userCount = await countUsuarios();
    res.json({ usuarios: allUsers.rows, count: userCount });
  } catch (error) {
    next(error);
  }
};


