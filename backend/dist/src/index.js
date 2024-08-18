"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_js_1 = require("./socket/socket.js");
dotenv_1.default.config();
const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve();
socket_js_1.app.use((0, cookie_parser_1.default)()); // for parsing cookies
socket_js_1.app.use(express_1.default.json()); // for parsing application/json
socket_js_1.app.use("/api/auth", auth_routes_1.default);
socket_js_1.app.use("/api/messages", messages_routes_1.default);
if (process.env.NODE_ENV !== "development") {
    socket_js_1.app.use(express_1.default.static(path_1.default.join(__dirname, "/frontend/dist")));
    socket_js_1.app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "frontend", "dist", "index.html"));
    });
}
socket_js_1.server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
