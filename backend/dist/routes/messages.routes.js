"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const message_controller_1 = require("../controllers/message.controller");
const router = (0, express_1.Router)();
router.get('/conversations', protectRoute_1.default, message_controller_1.getUsersForSideBar);
router.get('/:id', protectRoute_1.default, message_controller_1.getMessages);
router.post('/send/:id', protectRoute_1.default, message_controller_1.sendMessage);
exports.default = router;
