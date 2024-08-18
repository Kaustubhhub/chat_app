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
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
// Initialize middlewares
socket_1.app.use((0, cors_1.default)());
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
// Define routes
socket_1.app.use('/api/auth', auth_routes_1.default);
socket_1.app.use('/api/messages', messages_routes_1.default);
// Serve frontend static files in production
if (process.env.NODE_ENV !== 'development') {
    socket_1.app.use(express_1.default.static(path_1.default.join(__dirname, 'frontend', 'dist')));
    socket_1.app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
}
// Start the server
socket_1.server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
