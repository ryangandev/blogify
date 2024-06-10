import { Router } from 'express';

import {
    authenticateToken,
    authorizeRoles,
} from '../middleware/authMiddleware';
import {
    getAllUsers,
    getAllPosts,
    deleteUser,
    deletePost,
} from '../controllers/adminController';

const router = Router();

// Get all users
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);

// Get all posts
router.get('/posts', authenticateToken, authorizeRoles('admin'), getAllPosts);

// Delete a user by ID
router.delete(
    '/users/:id',
    authenticateToken,
    authorizeRoles('admin'),
    deleteUser,
);

// Delete a post by ID
router.delete(
    '/posts/:id',
    authenticateToken,
    authorizeRoles('admin'),
    deletePost,
);

export default router;
