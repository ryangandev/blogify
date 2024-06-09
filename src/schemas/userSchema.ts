import { z } from 'zod';

const registerSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(20, {
            message: 'Username must be within 20 characters',
        }),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, { message: 'Password is required' }),
});

export { registerSchema, loginSchema };
