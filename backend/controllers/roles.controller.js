import db from '../db.js';

export const createRol = async (req, res, next) => {
  try {
    const { nombre_rol } = req.body;

    const newRol = await db.query(
      'INSERT INTO rol (nombre_rol) VALUES($1) RETURNING *',
      [nombre_rol]
    );

    res.json(newRol.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    const allRoles = await db.query('SELECT * FROM rol');
    const rolCount = await countRoles();
    res.json({ roles: allRoles.rows, count: rolCount });
  } catch (error) {
    next(error);
  }
};

export const countRoles = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM "rol"`);
  return parseInt(result.rows[0].count, 10);
};

export const getRol = async (req, res,next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM rol WHERE id_rol = $1', [
      id
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Rol not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_rol } = req.body;

    const result = await db.query(
      'UPDATE rol SET nombre_rol = $1 WHERE id_rol = $2 RETURNING *',
      [nombre_rol, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Rol not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM rol WHERE id_rol = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Rol not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
