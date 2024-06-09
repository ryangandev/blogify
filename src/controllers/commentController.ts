import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import { commentSchema, updateCommentSchema } from '../schemas/commentSchema';
import {
    createCommentInDb,
    deleteCommentFromDb,
    getFirstLevelCommentsByPostIdFromDb,
    getNextLevelCommentsByParentIdFromDb,
    updateCommentInDb,
} from '../repositories/commentRepository';

const createComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = commentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid comment data',
                errors: result.error.errors,
            });
        }

        const { postId, parentId, content } = result.data;
        const newComment = await createCommentInDb(
            postId,
            req.user.userId, // Use userId from JWT token
            content,
            parentId,
        );
        return res.status(201).json(newComment);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getFirstLevelCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        const comments = await getFirstLevelCommentsByPostIdFromDb(
            postId,
            Number(page),
            Number(limit),
        );
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getNextLevelCommentsByParentId = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const { page = 1, limit = 5 } = req.query;
        const comments = await getNextLevelCommentsByParentIdFromDb(
            commentId,
            Number(page),
            Number(limit),
        );
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = updateCommentSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid comment data',
                errors: result.error.errors,
            });
        }

        const { commentId } = req.params;
        const { content } = result.data;
        const updatedComment = await updateCommentInDb(
            commentId,
            content,
            req.user.userId, // Use userId from JWT token
        );
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        return res.status(200).json(updatedComment);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const deleted = await deleteCommentFromDb(commentId);
        if (!deleted) {
            return res.status(404).json({
                message: 'Comment not found',
            });
        }
        return res.status(200).json({
            message: 'Comment deleted successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export {
    createComment,
    getFirstLevelCommentsByPostId,
    getNextLevelCommentsByParentId,
    updateComment,
    deleteComment,
};
