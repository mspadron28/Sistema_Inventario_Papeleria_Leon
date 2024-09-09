import express from 'express';

const router = express.Router();

import rolesRouter from './roles.routes.js';
import userRouter from './user.routes.js';
import categoriaRouter from './categoria.routes.js';  
import productoRouter from './producto.routes.js'; 
import existenciaRouter from './existencia.routes.js';
import entradaRouter from './entrada.routes.js';
import salidaRouter from './salida.routes.js';
import proveedorRouter from './proveedor.routes.js';
import gestionaRouter from './gestiona.routes.js';


router.use('/roles', rolesRouter);
router.use('/users', userRouter);
router.use('/categorias', categoriaRouter); 
router.use('/productos', productoRouter); 
router.use('/existencias', existenciaRouter);
router.use('/entradas', entradaRouter);
router.use('/salidas', salidaRouter);
router.use('/proveedores', proveedorRouter);
router.use('/gestiona', gestionaRouter);
export default router;
