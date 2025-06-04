import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import studentRoutes from './routes/auth';
import outingRoutes from './routes/outingRoutes';
import stayRoutes from './routes/stayRoutes';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

console.log('서버 초기화 시작...');

// CORS 설정
app.use(cors({
  origin: ['https://web-sbon-system-frontend-mbhiy4va1af0e6e0.sel4.cloudtype.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 라우트 설정
console.log('라우터 등록 시작...');
console.log('outing 라우터 등록...');
app.use('/api/outing', outingRoutes);
console.log('stay 라우터 등록...');
app.use('/api/stay', stayRoutes);
console.log('student 라우터 등록...');
app.use('/api/student', studentRoutes);
console.log('라우터 등록 완료');

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SBON System Backend' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app; 