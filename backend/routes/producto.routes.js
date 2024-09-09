import { Router } from 'express';
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  getProducto,
  updateProducto,
  getProductosByCategoria
} from '../controllers/producto.controller.js';

const router = Router();

router.route('/').get(getAllProductos).post(createProducto);
router.route('/:id').get(getProducto).put(updateProducto).delete(deleteProducto);
router.route('/categoria/:categoriaId').get(getProductosByCategoria); 
export default router;
