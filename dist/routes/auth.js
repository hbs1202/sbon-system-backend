"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// 학생 로그인 API
router.post('/login', authController_1.getStudentByPhone);
// 학생 이름 조회 API
router.get('/student/name/:phone', authController_1.getStudentName);
exports.default = router;
