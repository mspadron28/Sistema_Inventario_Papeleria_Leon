import db from '../db.js';
import subjectInstance from './observer.js';
import { broadcast } from '../index.js';

export const createSalida = async (req, res, next) => {
  try {
    const { id_existencia, cantidad_salida, fecha_salida, id_usuario } = req.body;

    const newSalida = await db.query(
      'INSERT INTO salida (id_existencia, cantidad_salida, fecha_salida) VALUES ($1, $2, $3) RETURNING *',
      [id_existencia, cantidad_salida, fecha_salida]
    );
    // Notificación a los observadores
    console.log('Notificando observers una salida');
    subjectInstance.notify({ id_existencia, cantidad: cantidad_salida, operation: 'salida' });

    const result = await db.query(
      'SELECT * FROM gestiona WHERE id_usuario = $1 AND id_existencia = $2',
      [id_usuario, id_existencia]
    );

   
    if (result.rowCount === 0) {
      await db.query(
        'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
        [id_usuario, id_existencia]
      );
    }

    try {
      const queryText = 'UPDATE existencia SET stockactual_existencia = stockactual_existencia - $1 WHERE id_existencia = $2';
      console.log('Executing query:', queryText, [cantidad_salida, id_existencia]);
      await db.query(
          queryText,
          [cantidad_salida, id_existencia]
      );
  } catch (error) {
      console.error('Error updating stock:', error);
  }

    // Enviar actualización a todos los clientes conectados
    broadcast({ type: 'NEW_SALIDA', payload: newSalida.rows[0] });
    res.json(newSalida.rows[0]);
  } catch (error) {
    next(error);
  }
};

/*
export const createSalida = async (req, res, next) => {
  try {
    const { id_existencia, cantidad_salida, fecha_salida, id_usuario } = req.body;

    // Crear la nueva salida
    const newSalida = await db.query(
      'INSERT INTO salida (id_existencia, cantidad_salida, fecha_salida) VALUES ($1, $2, $3) RETURNING *',
      [id_existencia, cantidad_salida, fecha_salida]
    );

    // Actualizar el stock actual en la tabla existencia
    await db.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia - $1 WHERE id_existencia = $2',
      [cantidad_salida, id_existencia]
    );

    // Verificar si la relación ya existe en la tabla gestiona
    const result = await db.query(
      'SELECT * FROM gestiona WHERE id_usuario = $1 AND id_existencia = $2',
      [id_usuario, id_existencia]
    );

    // Si la relación no existe, crearla
    if (result.rowCount === 0) {
      await db.query(
        'INSERT INTO gestiona (id_usuario, id_existencia) VALUES ($1, $2)',
        [id_usuario, id_existencia]
      );
    }

    res.json(newSalida.rows[0]);
  } catch (error) {
    next(error);
  }
};*/

export const getAllSalidas = async (req, res, next) => {
  try {
    const query = `
      SELECT 
          s.id_salida, 
          s.cantidad_salida, 
          s.fecha_salida, 
          c.nombre_categoria, 
          pr.nombre_proveedor, 
          p.nombre_producto, 
          u.nombre_usuario AS gestionada_por
      FROM 
          salida s
      JOIN 
          existencia e ON s.id_existencia = e.id_existencia
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
    const allSalidas = await db.query(query);
    const salidaCount = await countSalidas();
    res.json({ salidas: allSalidas.rows, count: salidaCount });

  } catch (error) {
    next(error);
  }
};

export const countSalidas = async () => {
  const result = await db.query(`SELECT COUNT(*) FROM "salida"`);
  return parseInt(result.rows[0].count, 10);
};


export const getSalida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM salida WHERE id_salida = $1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Salida not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateSalida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_existencia, cantidad_salida, fecha_salida } = req.body;

    // Obtener la salida actual para determinar la diferencia en la cantidad
    const currentSalida = await db.query('SELECT cantidad_salida FROM salida WHERE id_salida = $1', [id]);
    if (currentSalida.rows.length === 0) return res.status(404).json({ message: 'Salida not found' });

    const currentCantidadSalida = currentSalida.rows[0].cantidad_salida;
    const cantidadDiferencia = cantidad_salida - currentCantidadSalida;

    // Actualizar la salida
    const result = await db.query(
      'UPDATE salida SET id_existencia = $1, cantidad_salida = $2, fecha_salida = $3 WHERE id_salida = $4 RETURNING *',
      [id_existencia, cantidad_salida, fecha_salida, id]
    );

    // Actualizar el stock actual en la tabla existencia
    await db.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia - $1 WHERE id_existencia = $2',
      [cantidadDiferencia, id_existencia]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteSalida = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener la salida actual para determinar la cantidad a restar del stock
    const currentSalida = await db.query('SELECT id_existencia, cantidad_salida FROM salida WHERE id_salida = $1', [id]);
    if (currentSalida.rows.length === 0) return res.status(404).json({ message: 'Salida not found' });

    const { id_existencia, cantidad_salida } = currentSalida.rows[0];

    // Eliminar la salida
    const result = await db.query('DELETE FROM salida WHERE id_salida = $1', [id]);

    // Actualizar el stock actual en la tabla existencia
    await db.query(
      'UPDATE existencia SET stockactual_existencia = stockactual_existencia + $1 WHERE id_existencia = $2',
      [cantidad_salida, id_existencia]
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};


