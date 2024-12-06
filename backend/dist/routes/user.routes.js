"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes login,register and profile
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
userRouter.post("/register", user_controller_1.default.register);
userRouter.post("/login", user_controller_1.default.login);
userRouter.get("/profile", auth_1.default, user_controller_1.default.userProfile);
userRouter.post("/logout", auth_1.default, user_controller_1.default.logout);
userRouter.get("/check-login", auth_1.default, user_controller_1.default.checkLogin);
exports.default = userRouter;
