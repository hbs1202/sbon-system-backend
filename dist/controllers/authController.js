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
exports.getStudentName = exports.getStudentByPhone = void 0;
const database_1 = require("../config/database");
const mssql_1 = __importDefault(require("mssql"));
const getStudentByPhone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.poolConnect;
        const { phone } = req.body;
        const result = yield database_1.pool.request()
            .input('phone', mssql_1.default.VarChar, phone)
            .query('EXEC GetStudentByPhone @phone');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        }
        else {
            res.status(404).json({ message: '등록된 핸드폰 번호가 없습니다.' });
        }
    }
    catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.getStudentByPhone = getStudentByPhone;
const getStudentName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.poolConnect;
        const { phone } = req.params;
        const request = database_1.pool.request();
        request.input('School_Cd', mssql_1.default.VarChar(5), '01');
        request.input('Student_Hp_No', mssql_1.default.VarChar(20), phone);
        const result = yield request.query('EXEC x_Web_Student_Login @School_Cd=@School_Cd, @Student_Hp_No=@Student_Hp_No');
        if (result.recordset && result.recordset.length > 0) {
            const student = result.recordset[0];
            const responseData = {
                Student_ID: student.Student_iD,
                Student_Name: student.Student_Name,
                Grade: student.Grade,
                Pwd: student.Pwd
            };
            res.json(responseData);
        }
        else {
            res.status(404).json({ message: '등록된 핸드폰 번호가 없습니다.' });
        }
    }
    catch (err) {
        console.error('=================================');
        console.error('API 오류 발생');
        console.error('오류 메시지:', err instanceof Error ? err.message : 'Unknown error');
        console.error('오류 스택:', err instanceof Error ? err.stack : 'No stack trace');
        console.error('=================================');
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.getStudentName = getStudentName;
