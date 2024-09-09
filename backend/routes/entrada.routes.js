import { Router } from 'express';
import {
  createEntrada,
  deleteEntrada,
  getAllEntradas,
  getEntrada,
  updateEntrada,
 

} from '../controllers/entrada.controller.js';

const router = Router();

router.route('/').get(getAllEntradas).post(createEntrada);
router.route('/:id').get(getEntrada).put(updateEntrada).delete(deleteEntrada);
export default router;
