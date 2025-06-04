import { Request, Response } from 'express';
import { pool, poolConnect } from '../config/database';
import sql from 'mssql';

export const getStudentByPhone = async (req: Request, res: Response) => {
  console.log('=================================');
  console.log('getStudentByPhone API 호출됨');
  console.log('요청 데이터:', req.body);
  
  try {
    console.log('데이터베이스 연결 시도...');
    await poolConnect;
    console.log('데이터베이스 연결 성공');
    
    const { phone } = req.body;
    console.log('조회할 전화번호:', phone);
    
    console.log('SQL 쿼리 실행...');
    const result = await pool.request()
      .input('phone', sql.VarChar, phone)
      .query('EXEC GetStudentByPhone @phone');
    
    console.log('쿼리 결과:', result.recordset);
    
    if (result.recordset.length > 0) {
      console.log('학생 정보 찾음:', result.recordset[0]);
      res.json(result.recordset[0]);
    } else {
      console.log('학생 정보를 찾을 수 없음');
      res.status(404).json({ message: '등록된 핸드폰 번호가 없습니다.' });
    }
  } catch (err) {
    console.error('=================================');
    console.error('API 오류 발생');
    console.error('오류 메시지:', err instanceof Error ? err.message : 'Unknown error');
    console.error('오류 스택:', err instanceof Error ? err.stack : 'No stack trace');
    console.error('=================================');
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getStudentName = async (req: Request, res: Response) => {
  console.log('=================================');
  console.log('getStudentName API 호출됨');
  console.log('요청 파라미터:', req.params);
  console.log('요청 URL:', req.url);
  console.log('요청 메소드:', req.method);
  console.log('요청 헤더:', req.headers);
  
  try {
    console.log('데이터베이스 연결 시도...');
    await poolConnect;
    console.log('데이터베이스 연결 성공');
    
    const { phone } = req.params;
    console.log('조회할 전화번호:', phone);
    
    console.log('SQL 쿼리 실행...');
    const request = pool.request();
    request.input('School_Cd', sql.VarChar(5), '01');
    request.input('Student_Hp_No', sql.VarChar(20), phone);
    
    console.log('실행할 쿼리:', 'EXEC x_Web_Student_Login @School_Cd=@School_Cd, @Student_Hp_No=@Student_Hp_No');
    console.log('쿼리 파라미터:', { School_Cd: '01', Student_Hp_No: phone });
    
    const result = await request.query('EXEC x_Web_Student_Login @School_Cd=@School_Cd, @Student_Hp_No=@Student_Hp_No');
    console.log('쿼리 결과:', result.recordset);
    
    if (result.recordset && result.recordset.length > 0) {
      const student = result.recordset[0];
      const responseData = {
        Student_ID: student.Student_iD,
        Student_Name: student.Student_Name,
        Grade: student.Grade,
        Pwd: student.Pwd
      };
      console.log('응답 데이터:', responseData);
      res.json(responseData);
    } else {
      console.log('학생 정보를 찾을 수 없음');
      res.status(404).json({ message: '등록된 핸드폰 번호가 없습니다.' });
    }
  } catch (err) {
    console.error('=================================');
    console.error('API 오류 발생');
    console.error('오류 메시지:', err instanceof Error ? err.message : 'Unknown error');
    console.error('오류 스택:', err instanceof Error ? err.stack : 'No stack trace');
    console.error('=================================');
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 