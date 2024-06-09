import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import { postSchema } from '../schemas/postSchema';
import {
    createPostInDb,
    getPostsFromDb,
    getUserPostsFromDb,
    getPostByIdFromDb,
    updatePostByIdInDb,
    deletePostByIdFromDb,
    searchPostsFromDb,
} from '../repositories/postRepository';

const createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = postSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid post data',
                errors: result.error.errors,
            });
        }

        const { title, content } = result.data;

        const newPost = await createPostInDb(title, content, req.user.userId); // Use userId from JWT token

        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getPosts = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 5,
            sortBy = 'created_at',
            order = 'desc',
        } = req.query;
        const posts = await getPostsFromDb(
            Number(page),
            Number(limit),
            String(sortBy),
            String(order),
        );
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserPosts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { page = 1, limit = 5, sortBy = 'created_at' } = req.query;
        const userId = req.user.userId;

        const posts = await getUserPostsFromDb(
            userId,
            Number(page),
            Number(limit),
        );
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get post ID from request parameters ex: /posts/123
        const post = await getPostByIdFromDb(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updatePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = postSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid post data',
                errors: result.error.errors,
            });
        }

        const { title, content } = result.data;

        const updatedPost = await updatePostByIdInDb(
            id,
            title,
            content,
            req.user.userId, // Use userId from JWT token
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await deletePostByIdFromDb(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Post not found',
            });
        }

        return res.status(200).json({
            message: 'Post deleted successfully!',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const searchPosts = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        const posts = await searchPostsFromDb(String(query));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createPost,
    getPosts,
    getUserPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
};
