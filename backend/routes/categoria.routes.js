import { Router } from 'express';
import {
  createCategoria,
  deleteCategoria,
  getAllCategorias,
  getCategoria,
  updateCategoria,
} from '../controllers/categoria.controller.js';

const router = Router();

router.route('/').get(getAllCategorias).post(createCategoria);
router.route('/:id').get(getCategoria).put(updateCategoria).delete(deleteCategoria);
export default router;
