"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    console.log('Cookies received:', req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
        res.status(403).json({ message: 'Access denied' });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('Token decoded successfully:', decoded);
        req.user = decoded;
        next();
    });
};
exports.default = authenticateToken;
