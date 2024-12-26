"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const survey_routes_1 = __importDefault(require("./routes/survey.routes"));
const survey_socket_1 = __importDefault(require("./socket/survey.socket"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
// Database
(0, db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    "http://localhost:4321",
    "https://votingapp-seven.vercel.app"
];
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
// const corsOptions = {
//   origin: (origin: string | undefined, callback: (err: Error | null, allowed: boolean) => void) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"), false);
//     }
//   },
//   credentials: true,
// };
app.use((0, cors_1.default)(corsOptions));
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/users", user_routes_1.default);
app.use("/api/surveys", survey_routes_1.default);
const surveySocket = new survey_socket_1.default(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
