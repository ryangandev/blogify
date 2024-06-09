import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { loginSchema, registerSchema } from '../schemas/userSchema';
import { createUser, getUserByEmail } from '../repositories/userRepository';

const registerUser = async (req: Request, res: Response) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid username, email or password',
                errors: result.error.errors,
            });
        }

        const { username, email, password } = result.data;

        // Check if user already exists
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await createUser(username, email, hashedPassword);

        return res
            .status(201)
            .json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid email or password',
                errors: result.error.errors,
            });
        }

        const { email, password } = result.data;

        // Check if user exists
        const existingUser = await getUserByEmail(email);
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password,
        );
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: existingUser.id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: '1h',
            },
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent access to the cookie via JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensure cookie is only sent over HTTPS
            sameSite: 'strict', // Ensure cookie is only sent with same-site requests to prevent CSRF
            maxAge: 3600000, // 1 hour
        });

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { registerUser, loginUser };
