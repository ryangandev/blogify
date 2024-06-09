import { z } from 'zod';

const commentSchema = z.object({
    postId: z.string().min(1, { message: 'Post ID is required' }),
    parentId: z.string().optional(),
    content: z.string().min(1, { message: 'Content is required' }),
});

const updateCommentSchema = z.object({
    content: z.string().min(1, { message: 'Content is required' }),
});

export { commentSchema, updateCommentSchema };
