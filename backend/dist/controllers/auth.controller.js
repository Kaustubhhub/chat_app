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
exports.getME = exports.logout = exports.login = exports.signup = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        console.log('req.body', req.body);
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill all the data." });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "password and confirm password must be same." });
        }
        const existingUser = yield db_1.prisma.user.findFirst({
            where: {
                username: username
            }
        });
        if (existingUser) {
            return res.json({
                error: "email already exists"
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = yield db_1.prisma.user.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
            }
        });
        if (newUser) {
            (0, generateToken_1.default)(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.fullname,
                profilePic: newUser.profilePic
            });
        }
        else {
            res.status(400).json({
                error: "invalid     user data"
            });
        }
    }
    catch (er) {
        console.log(er);
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "incorrect credentials." });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "incorrect credentials." });
        }
        (0, generateToken_1.default)(user.id, res);
        res.json({
            id: user.id,
            fullname: user.fullname,
            username: user.fullname,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out successfully." });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ error: "Internal server error." });
    }
});
exports.logout = logout;
const getME = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({
                error: "user not found"
            });
        }
        res.json({
            id: user.id,
            fullname: user.fullname,
            username: user.fullname,
            profilePic: user.profilePic
        });
    }
    catch (error) {
    }
});
exports.getME = getME;
