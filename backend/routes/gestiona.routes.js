import { Router } from 'express';
import {
  getAllGestiona,
  getGestiona
} from '../controllers/gestiona.controller.js';

const router = Router();

router.route('/').get(getAllGestiona);
router.route('/:id').get(getGestiona);

export default router;
