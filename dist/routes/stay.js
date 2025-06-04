"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stayController_1 = require("../controllers/stayController");
const router = (0, express_1.Router)();
// 외박 신청 API
router.post('/register', stayController_1.registerStay);
// 외박 복귀 API
router.post('/return', stayController_1.returnStay);
exports.default = router;
