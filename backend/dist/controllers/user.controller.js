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
const user_model_1 = __importDefault(require("../model/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    //register
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const user = yield user_model_1.default.create({ email, password, username });
                const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
                res.status(201).json({ message: 'User registered successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error registering user' });
            }
        });
    }
    // login
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const isMatch = yield user.matchPassword(password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
                return res.status(200).json({ message: 'Login successful' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Error logging in', error });
            }
        });
    }
    // user profile
    userProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.user;
                const user = yield user_model_1.default.findOne({ username });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting user', error });
            }
        });
    }
    // logout
    logout(req, res) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Asegúrate de que esté en true en producción
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 0 // Establecer maxAge en 0 asegura que la cookie se elimine inmediatamente
        });
        res.status(200).json({ message: 'Logout successful' });
    }
}
exports.default = UserController;
