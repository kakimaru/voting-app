import { Request, Response } from 'express';
import User from '../model/user.model';
import jwt from 'jsonwebtoken';

class UserController {

    //register
    async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            const user = await User.create({ email, password, username });
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.cookie('jwt', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000  });
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user' });
        }
    }

    // login
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.cookie('jwt', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
            return res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            return res.status(500).json({ message: 'Error logging in', error });
        }
    }

    // user profile
    async userProfile(req: Request, res: Response) {
        try {
            const { username } = req.user!;  
            const user = await User.findOne({ username }); 
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user); 
        } catch (error) {
            return res.status(500).json({ message: 'Error getting user', error });
        }
    }
    // logout
    logout(req: Request, res: Response) {
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Asegúrate de que esté en true en producción
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 0 // Establecer maxAge en 0 asegura que la cookie se elimine inmediatamente
            });
            res.status(200).json({ message: 'Logout successful' });
        }
    }


export default UserController;