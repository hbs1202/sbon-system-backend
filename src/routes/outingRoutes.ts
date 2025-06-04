import express from 'express';
import { registerOuting, getOutingReasons, getOutingList, returnOuting } from '../controllers/outingController';

const router = express.Router();

router.post('/register', registerOuting);
router.get('/reasons', getOutingReasons);
router.get('/list/:studentId', getOutingList);
router.post('/return', returnOuting);

export default router; 