import { Request, Response } from 'express';

import {
    getAllUsersFromDb,
    getAllPostsFromDb,
    deleteUserFromDb,
    deletePostFromDb,
} from '../repositories/adminRepository';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersFromDb();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await getAllPostsFromDb();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await deleteUserFromDb(id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await deletePostFromDb(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
