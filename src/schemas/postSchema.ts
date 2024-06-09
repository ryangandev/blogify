import { z } from 'zod';

const postSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    content: z.string().min(1, { message: 'Content is required' }),
});

export { postSchema };
