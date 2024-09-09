import { Router } from 'express';
import {
  createExistencia,
  deleteExistencia,
  getAllExistencias,
  getExistencia,
  updateExistencia,
  getExistenciasMinimas,

} from '../controllers/existencia.controller.js';

const router = Router();

router.route('/').get(getAllExistencias).post(createExistencia);
router.route('/minimas').get(getExistenciasMinimas);
router.route('/:id').get(getExistencia).put(updateExistencia).delete(deleteExistencia);
export default router;
