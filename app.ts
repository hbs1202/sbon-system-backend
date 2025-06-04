import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import outingRoutes from './routes/outing';
import stayRoutes from './routes/stay';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

// CORS 설정
const corsOptions = {
  origin: ['https://sbon-system.firebaseapp.com', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 라우트 설정
app.use('/api', authRoutes);
app.use('/api/outing', outingRoutes);
app.use('/api/stay', stayRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SBON System Backend' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 