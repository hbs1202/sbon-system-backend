"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const outing_1 = __importDefault(require("./routes/outing"));
const stay_1 = __importDefault(require("./routes/stay"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
console.log('서버 초기화 시작...');
// CORS 설정
const corsOptions = {
    origin: ['https://sbon-system.firebaseapp.com', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// 요청 로깅 미들웨어
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// 라우트 설정
console.log('라우터 등록 시작...');
console.log('auth 라우터 등록...');
app.use('/api', auth_1.default);
console.log('outing 라우터 등록...');
app.use('/api/outing', outing_1.default);
console.log('stay 라우터 등록...');
app.use('/api/stay', stay_1.default);
console.log('라우터 등록 완료');
// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SBON System Backend' });
});
// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
