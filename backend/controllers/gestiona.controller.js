import db from '../db.js';

export const getAllGestiona = async (req, res, next) => {
  try {
    const allGestiona = await db.query('SELECT * FROM gestiona');
    res.json(allGestiona.rows);
  } catch (error) {
    next(error);
  }
};

export const getGestiona = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM gestiona WHERE id_existencia = $1', [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Gestiona not found' });

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
