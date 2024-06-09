import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import { userSchema } from '../schemas/userSchema';
import {
    getUsersFromDb,
    getUserByIdFromDb,
    getUserByUsernameFromDb,
    updateCurrentUserProfileInDb,
} from '../repositories/userRepository';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsersFromDb();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.user;
        const user = await getUserByIdFromDb(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const user = await getUserByUsernameFromDb(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await getUserByIdFromDb(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCurrentUserProfile = async (
    req: AuthenticatedRequest,
    res: Response,
) => {
    try {
        const result = userSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid user data',
                errors: result.error.errors,
            });
        }

        const userId = req.user.userId;
        const { username, email } = result.data;

        // TODO: Check if username and email already exist

        const updatedUser = await updateCurrentUserProfileInDb(
            userId,
            username,
            email,
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    getAllUsers,
    getCurrentUser,
    getUserByUsername,
    getUserByUserId,
    updateCurrentUserProfile,
};
