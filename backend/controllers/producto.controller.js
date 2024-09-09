import db from '../db.js';
export const createProducto = async (req, res, next) => {
  try {
    const { id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto } = req.body;

    const newProducto = await db.query(
      `INSERT INTO producto (id_categoria, nombre_producto, precio_producto, fechaexpiracion_producto) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto]
    );

    res.json(newProducto.rows[0]);
  } catch (error) {
    next(error);
  }
};



export const countProductos = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM "producto"`);
  return parseInt(result.rows[0].count, 10);
};

export const getAllProductos = async (req, res, next) => {
  try {
    const allProductos = await db.query(`SELECT * FROM "producto"`);
    const productoCount = await countProductos();
    res.json({ productos: allProductos.rows, count: productoCount });
  } catch (error) {
    next(error);
  }
};

export const getProductosByCategoria = async (req, res, next) => {
  try {
    const { categoriaId } = req.params;
    const result = await db.query('SELECT * FROM producto WHERE id_categoria = $1', [categoriaId]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'No products found for the given category' });

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM producto WHERE id_producto = $1', [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Producto not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto } = req.body;

    const result = await db.query(
      `UPDATE producto SET id_categoria = $1, nombre_producto = $2, precio_producto = $3, fechaexpiracion_producto = $4 
       WHERE id_producto = $5 RETURNING *`,
      [id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Producto not found' });

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM producto WHERE id_producto = $1', [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: 'Producto not found' });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};



