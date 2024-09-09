import db from '../db.js';

export const createExistencia = async (req, res, next) => {
  try {
    const { stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id_producto, id_proveedor, id_usuario } = req.body;

    // Crear la nueva existencia
    const newExistencia = await db.query(
      'INSERT INTO existencia (stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id_producto, id_proveedor, id_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id_producto, id_proveedor, id_usuario]
    );
    const id_existencia = newExistencia.rows[0].id_existencia;
    // Crear relación en la tabla gestiona
    await db.query(
      'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
      [id_usuario, id_existencia]
    );

    res.json(newExistencia.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllExistencias = async (req, res, next) => {
  try {
    const query = `
      SELECT 
          e.id_existencia, 
          e.stockinicial_existencia, 
          e.stockactual_existencia, 
          e.preciocompra_existencia, 
          e.precioventa_existencia, 
          p.nombre_producto, 
          c.nombre_categoria, 
          pr.nombre_proveedor, 
          u.nombre_usuario AS gestionada_por
      FROM 
          existencia e
      JOIN 
          producto p ON e.id_producto = p.id_producto
      JOIN 
          categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN 
          proveedor pr ON e.id_proveedor = pr.id_proveedor
      LEFT JOIN 
          gestiona g ON e.id_existencia = g.id_existencia
      LEFT JOIN 
          usuario u ON g.id_usuario = u.id_usuario;
    `;
    const existenciaCount = await countExistencias();
    const allExistencias = await db.query(query);
    res.json({ existencias: allExistencias.rows, count: existenciaCount });
  } catch (error) {
    next(error);
  }
};

export const countExistencias = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM "existencia"`);
  return parseInt(result.rows[0].count, 10);
};

export const getExistencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM existencia WHERE id_existencia = $1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Existencia not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateExistencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id_producto, id_proveedor, id_usuario } = req.body;

    const result = await db.query(
      'UPDATE existencia SET stockinicial_existencia = $1, stockactual_existencia = $2, preciocompra_existencia = $3, precioventa_existencia = $4, id_producto = $5, id_proveedor = $6, id_usuario = $7 WHERE id_existencia = $8 RETURNING *',
      [stockinicial_existencia, stockactual_existencia, preciocompra_existencia, precioventa_existencia, id_producto, id_proveedor, id_usuario, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Existencia not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteExistencia = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Eliminar la relación en la tabla gestiona
    await db.query('DELETE FROM gestiona WHERE id_existencia = $1', [id]);

    const result = await db.query('DELETE FROM existencia WHERE id_existencia = $1', [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: 'Existencia not found' });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getExistenciasMinimas = async (req, res, next) => {
  try {
    const query = `
      SELECT 
          e.id_existencia, 
          e.stockactual_existencia, 
          p.nombre_producto, 
          c.nombre_categoria, 
          pr.nombre_proveedor
      FROM 
          existencia e
      JOIN 
          producto p ON e.id_producto = p.id_producto
      JOIN 
          categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN 
          proveedor pr ON e.id_proveedor = pr.id_proveedor
      WHERE 
          e.stockactual_existencia < 20;
    `;
    const existenciasMinimas = await db.query(query);
    res.json(existenciasMinimas.rows);
  } catch (error) {
    next(error);
  }
};



