"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorised - no token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const user = await db_1.prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, username: true, fullname: true, profilePic: true } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log('error', error);
    }
};
exports.default = protectRoute;
