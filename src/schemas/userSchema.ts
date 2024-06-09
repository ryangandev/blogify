import { z } from 'zod';

const userSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(20, {
            message: 'Username must be within 20 characters',
        }),
    email: z.string().email('Invalid email address'),
});

export { userSchema };
