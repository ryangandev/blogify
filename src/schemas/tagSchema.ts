import { z } from 'zod';

const tagSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
});

export { tagSchema };
