import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';

// .env 파일 로드
dotenv.config({ path: path.join(__dirname, '../../.env') });

// 환경 변수 체크
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${missingEnvVars.join(', ')}`);
}

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

console.log('데이터베이스 연결 설정:', {
  user: config.user,
  server: config.server,
  database: config.database,
  options: config.options
});

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

export { pool, poolConnect }; 