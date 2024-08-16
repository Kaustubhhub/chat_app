"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/login', (req, res) => {
    res.json({
        data: "Logged in suucessfully"
    });
});
router.get('/signup', (req, res) => {
    res.json({
        data: "signup in suucessfully"
    });
});
router.get('/logout', (req, res) => {
    res.json({
        data: "Logged out suucessfully"
    });
});
exports.default = router;
