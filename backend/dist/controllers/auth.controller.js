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
exports.logout = exports.login = exports.signup = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, passoword, confirmPassword, gender } = req.body;
        if (!fullname || !username || !passoword || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill all the data." });
        }
        if (passoword !== confirmPassword) {
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
        console.log('salt', salt);
        // await prisma.user.create({
        //     data: {
        //         username: username,
        //         fullName: fullname,
        //         password: passoword
        //     }
        // })
    }
    catch (er) {
        console.log(er);
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.logout = logout;
