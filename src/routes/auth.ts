import { Router } from 'express';
import { getStudentByPhone, getStudentName } from '../controllers/authController';

const router = Router();

console.log('auth 라우터 초기화됨');

// 학생 로그인 API
router.post('/login', (req, res, next) => {
  console.log('=================================');
  console.log('auth 라우터: /login 요청 들어옴');
  console.log('요청 메소드:', req.method);
  console.log('요청 URL:', req.url);
  console.log('요청 바디:', req.body);
  next();
}, getStudentByPhone);

// 학생 이름 조회 API
router.get('/name/:phone', (req, res, next) => {
  console.log('=================================');
  console.log('auth 라우터: /name/:phone 요청 들어옴');
  console.log('요청 메소드:', req.method);
  console.log('요청 URL:', req.url);
  console.log('요청 파라미터:', req.params);
  next();
}, getStudentName);

export default router; 