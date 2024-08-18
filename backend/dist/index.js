"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = require("./socket/socket");
// const app = express();
socket_1.app.use((0, cors_1.default)());
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use('/api/auth', auth_routes_1.default);
socket_1.app.use('/api/messages', messages_routes_1.default);
socket_1.server.listen(5000, () => {
    console.log('The server is running on port 5000');
});
