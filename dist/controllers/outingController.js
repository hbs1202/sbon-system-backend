"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutingList = exports.getOutingReasons = exports.returnOuting = exports.registerOuting = void 0;
const database_1 = require("../config/database");
const mssql_1 = __importDefault(require("mssql"));
const registerOuting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.poolConnect;
        const { studentId, date, time, returnTime, reason1, reason2, otherReason } = req.body;
        const result = yield database_1.pool.request()
            .input('School_Cd', mssql_1.default.VarChar(5), '01')
            .input('Out_Dt', mssql_1.default.VarChar(10), date)
            .input('Seq', mssql_1.default.Int, 0)
            .input('Student_iD', mssql_1.default.VarChar(10), studentId)
            .input('Out_Time', mssql_1.default.VarChar(10), time)
            .input('Return_Time', mssql_1.default.VarChar(10), returnTime)
            .input('Out_Reason1', mssql_1.default.VarChar(2), reason1)
            .input('Out_Reason2', mssql_1.default.VarChar(2), reason2)
            .input('Etc_Reason', mssql_1.default.VarChar(200), otherReason)
            .input('Up_Man', mssql_1.default.VarChar(30), studentId)
            .execute('x_Web_OutingRegister');
        res.json({ message: '외출 신청이 완료되었습니다.' });
    }
    catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.registerOuting = registerOuting;
const returnOuting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.poolConnect;
        const { outDate, seq, returnType, returnNote } = req.body;
        console.log('외출 복귀 요청 데이터:', {
            outDate,
            seq,
            returnType,
            returnNote
        });
        const result = yield database_1.pool.request()
            .input('School_Cd', mssql_1.default.VarChar(5), '01')
            .input('Out_Dt', mssql_1.default.VarChar(10), outDate)
            .input('Seq', mssql_1.default.Int, seq)
            .input('Return_Gubun', mssql_1.default.VarChar(10), returnType)
            .input('Remark', mssql_1.default.VarChar(500), returnNote)
            .execute('x_Web_OutingReturn_Update');
        console.log('저장 프로시저 실행 결과:', result);
        res.json({ message: '외출 복귀가 완료되었습니다.' });
    }
    catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.returnOuting = returnOuting;
const getOutingReasons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(process.env.DB_CONFIG || '');
        const result = yield pool.request()
            .input('SysMst_Cd', mssql_1.default.VarChar(10), 'D01')
            .execute('x_Get_Cmb_SysCode_Query');
        res.json(result.recordset);
    }
    catch (err) {
        console.error('외출사유 데이터 조회 오류:', err);
        res.status(500).json({ error: '외출사유 데이터를 가져오는데 실패했습니다.' });
    }
});
exports.getOutingReasons = getOutingReasons;
const getOutingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('외출 내역 조회 API 호출');
        console.log('학생 ID:', req.params.studentId);
        yield database_1.poolConnect;
        const { studentId } = req.params;
        console.log('DB 쿼리 실행 전');
        const result = yield database_1.pool.request()
            .input('School_Cd', mssql_1.default.VarChar(5), '01')
            .input('Student_iD', mssql_1.default.VarChar(10), studentId)
            .execute('x_Web_OutingReturn_Query');
        console.log('DB 쿼리 결과:', result.recordset);
        res.json(result.recordset);
    }
    catch (err) {
        console.error('외출 내역 조회 오류:', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.getOutingList = getOutingList;
