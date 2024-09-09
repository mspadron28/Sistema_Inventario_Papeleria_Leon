import { Router } from 'express';
import {
  createSalida,
  deleteSalida,
  getAllSalidas,
  getSalida,
  updateSalida,
} from '../controllers/salida.controller.js';

const router = Router();

router.route('/').get(getAllSalidas).post(createSalida);
router.route('/:id').get(getSalida).put(updateSalida).delete(deleteSalida);
export default router;
