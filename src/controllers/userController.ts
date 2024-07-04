import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validateRegister, validateLogin } from '../utils/validation';

dotenv.config();

const createToken = (user: any) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
    const { error } = validateRegister(req.body);
    if (error) {
        console.error('Validation error:', error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            console.error('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, email, password });
        await user.save();

        const token = createToken(user);

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Server error during registration:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { error } = validateLogin(req.body);
    if (error) {
        console.error('Validation error:', error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Invalid credentials - user not found:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.error('Invalid credentials - password mismatch:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Server error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.json({ message: 'Logout successful' });
};

export const profile = async (req: Request, res: Response) => {
    const user = req.user;
    res.json({ user });
};
