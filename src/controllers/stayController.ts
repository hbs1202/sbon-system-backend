import { Request, Response } from 'express';
import { pool, poolConnect } from '../config/database';
import { sendSMS } from '../config/sms';
import sql from 'mssql';

export const registerStay = async (req: Request, res: Response) => {
  try {
    await poolConnect;
    const { 
      studentId, 
      date, 
      time, 
      returnDate, 
      returnTime, 
      reason, 
      otherReason 
    } = req.body;

    const result = await pool.request()
      .input('School_Cd', sql.VarChar(5), '01')
      .input('SleepOut_Dt', sql.VarChar(10), date)
      .input('Seq', sql.Int, 0)
      .input('Student_iD', sql.VarChar(10), studentId)
      .input('SleepOut_Time', sql.VarChar(10), time)
      .input('Return_Date', sql.VarChar(10), returnDate)
      .input('Return_Time', sql.VarChar(10), returnTime)
      .input('SleepOut_Reason', sql.VarChar(2), reason)
      .input('Etc_Reason', sql.VarChar(200), otherReason)
      .input('Up_Man', sql.VarChar(30), studentId)
      .execute('x_Web_SleepOutRegister');

    // SMS 전송
    try {
      const message = `[외박 신청]\n외박일자: ${date}\n외박시간: ${time}\n복귀일자: ${returnDate}\n복귀시간: ${returnTime}\n외박사유: ${otherReason}`;
      await sendSMS(message);
    } catch (smsError) {
      console.error('SMS 전송 실패:', smsError);
    }

    res.json({ message: '외박 신청이 완료되었습니다.' });
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const returnStay = async (req: Request, res: Response) => {
  try {
    await poolConnect;
    const { sleepOut_dt, seq, returnType, returnNote } = req.body;
    
    console.log('외박 복귀 요청 데이터:', {
      sleepOut_dt,
      seq,
      returnType,
      returnNote
    });

    const result = await pool.request()
      .input('School_Cd', sql.VarChar(5), '01')
      .input('SleepOut_Dt', sql.VarChar(10), sleepOut_dt)
      .input('Seq', sql.Int, seq)
      .input('Return_Gubun', sql.VarChar(10), returnType)
      .input('Remark', sql.VarChar(500), returnNote)
      .execute('x_Web_SleepOutReturn_Update');
    
    console.log('저장 프로시저 실행 결과:', result);
    
    res.json({ message: '외박 복귀가 완료되었습니다.' });
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

export const getStayReasons = async (req: Request, res: Response) => {
  console.log('=== 외박사유 조회 API 호출 시작 ===');
  try {
    console.log('데이터베이스 연결 시도...');
    await poolConnect;
    console.log('데이터베이스 연결 성공');

    console.log('저장 프로시저 실행 준비...');
    const request = pool.request();
    request.input('SysMst_Cd', sql.VarChar(10), 'D02');
    
    console.log('실행할 쿼리:', 'EXEC x_Get_Cmb_SysCode_Query @SysMst_Cd=@SysMst_Cd');
    console.log('쿼리 파라미터:', { SysMst_Cd: 'D02' });

    const result = await request.execute('x_Get_Cmb_SysCode_Query');
    console.log('쿼리 실행 결과:', result.recordset);

    if (result.recordset && result.recordset.length > 0) {
      console.log('외박사유 데이터 조회 성공');
      res.json(result.recordset);
    } else {
      console.log('외박사유 데이터가 없음');
      res.json([]);
    }
  } catch (err) {
    console.error('=== 외박사유 데이터 조회 오류 ===');
    console.error('에러 객체:', err);
    console.error('에러 메시지:', err instanceof Error ? err.message : 'Unknown error');
    console.error('에러 스택:', err instanceof Error ? err.stack : 'No stack trace');
    res.status(500).json({ error: '외박사유 데이터를 가져오는데 실패했습니다.' });
  }
  console.log('=== 외박사유 조회 API 호출 종료 ===');
}; 

export const getSlieepOutList = async (req: Request, res: Response) => {
  console.log('=== 외출 목록 조회 API 호출 시작 ===');
  try {
    const { studentId } = req.params;
    console.log('조회할 학생 ID:', studentId);

    await poolConnect;
    console.log('데이터베이스 연결 성공');

    const result = await pool.request()
      .input('School_Cd', sql.VarChar(5), '01')
      .input('Student_iD', sql.VarChar(10), studentId)
      .execute('x_Web_SlieepOutReturn_Query');

    console.log('쿼리 실행 결과:', result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('=== 외출 목록 조회 오류 ===');
    console.error('에러 객체:', err);
    console.error('에러 메시지:', err instanceof Error ? err.message : 'Unknown error');
    console.error('에러 스택:', err instanceof Error ? err.stack : 'No stack trace');
    res.status(500).json({ error: '외출 목록을 가져오는데 실패했습니다.' });
  }
  console.log('=== 외출 목록 조회 API 호출 종료 ===');
}; 