import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import { getAuthorIdByPostIdFromDb } from '../repositories/postRepository';

export const verifyAuthor = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { postId } = req.body;
        const authorId = await getAuthorIdByPostIdFromDb(postId);

        if (!authorId) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (authorId !== req.user.userId) {
            return res.status(403).json({
                message: 'You are not authorized to modify tags for this post',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
