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
exports.returnStay = exports.registerStay = void 0;
const database_1 = require("../config/database");
const mssql_1 = __importDefault(require("mssql"));
const registerStay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.poolConnect;
        const { studentId, date, time, returnDate, reason, otherReason } = req.body;
        const result = yield database_1.pool.request()
            .input('studentId', mssql_1.default.VarChar, studentId)
            .input('date', mssql_1.default.Date, date)
            .input('time', mssql_1.default.Time, time)
            .input('returnDate', mssql_1.default.Date, returnDate)
            .input('reason', mssql_1.default.VarChar, reason)
            .input('otherReason', mssql_1.default.VarChar, otherReason)
            .query('EXEC RegisterStay @studentId, @date, @time, @returnDate, @reason, @otherReason');
        res.json({ message: '외박 신청이 완료되었습니다.' });
    }
    catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.registerStay = registerStay;
const returnStay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.poolConnect;
        const { stayId, returnDate, returnTime, note } = req.body;
        const result = yield database_1.pool.request()
            .input('stayId', mssql_1.default.VarChar, stayId)
            .input('returnDate', mssql_1.default.Date, returnDate)
            .input('returnTime', mssql_1.default.Time, returnTime)
            .input('note', mssql_1.default.VarChar, note)
            .query('EXEC ReturnStay @stayId, @returnDate, @returnTime, @note');
        res.json({ message: '외박 복귀가 완료되었습니다.' });
    }
    catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});
exports.returnStay = returnStay;
