import express from 'express';
import { registerStay, getStayReasons, getSlieepOutList, returnStay } from '../controllers/stayController';

const router = express.Router();

router.post('/register', registerStay);
router.get('/reasons', getStayReasons);
router.get('/list/:studentId', getSlieepOutList);
router.post('/return', returnStay);

export default router; 