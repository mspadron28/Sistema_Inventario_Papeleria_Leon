import { Router } from 'express';
import {
  createProveedor,
  deleteProveedor,
  getAllProveedores,
  getProveedor,
  updateProveedor,


} from '../controllers/proveedor.controller.js';

const router = Router();

router.route('/').get(getAllProveedores).post(createProveedor);
router.route('/:id').get(getProveedor).put(updateProveedor).delete(deleteProveedor);


export default router;
