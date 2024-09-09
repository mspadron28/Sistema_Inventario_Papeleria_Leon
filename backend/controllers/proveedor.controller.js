import db from '../db.js';

// Crear un proveedor
export const createProveedor = async (req, res, next) => {
  try {
    const { nombre_proveedor, correo_proveedor, telefono } = req.body;

    const newProveedor = await db.query(
      'INSERT INTO proveedor (nombre_proveedor, correo_proveedor, telefono) VALUES($1, $2, $3) RETURNING *',
      [nombre_proveedor, correo_proveedor, telefono]
    );

    res.json(newProveedor.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los proveedores
export const countProveedores = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM "proveedor"`);
  return parseInt(result.rows[0].count, 10);
};

export const getAllProveedores = async (req, res, next) => {
  try {
    const allProveedores = await db.query(`SELECT * FROM "proveedor"`);
    const proveedorCount = await countProveedores();
    res.json({ proveedores: allProveedores.rows, count: proveedorCount });
  } catch (error) {
    next(error);
  }
};

// Obtener un proveedor por ID
export const getProveedor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM proveedor WHERE id_proveedor = $1', [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Proveedor not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_proveedor, correo_proveedor, telefono } = req.body;

    const result = await db.query(
      'UPDATE proveedor SET nombre_proveedor = $1, correo_proveedor = $2, telefono = $3 WHERE id_proveedor = $4 RETURNING *',
      [nombre_proveedor, correo_proveedor, telefono, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Proveedor not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


export const deleteProveedor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM proveedor WHERE id_proveedor = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Proveedor not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};


