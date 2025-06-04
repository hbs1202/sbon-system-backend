"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const outingController_1 = require("../controllers/outingController");
const router = (0, express_1.Router)();
// 외출 신청 API
router.post('/register', outingController_1.registerOuting);
// 외출 복귀 API
router.post('/return', outingController_1.returnOuting);
// 외출사유 데이터 가져오기
router.get('/reasons', outingController_1.getOutingReasons);
// 외출 내역 조회 API
router.get('/list/:studentId', outingController_1.getOutingList);
exports.default = router;
