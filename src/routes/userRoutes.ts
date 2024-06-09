import Router from 'express';

import {
    authenticateToken,
    authorizeRoles,
} from '../middleware/authMiddleware';
import {
    getAllUsers,
    getCurrentUser,
    getUserByUsername,
    getUserByUserId,
    updateCurrentUserProfile,
} from '../controllers/userController';

const router = Router();

// Get all users
router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);

// Get current user profile
router.get('/me', authenticateToken, getCurrentUser);

// Get user profile by username
router.get('/username/:username', authenticateToken, getUserByUsername);

// Get user profile by id
router.get('/userId/:userId', authenticateToken, getUserByUserId);

// Update user profile
router.put('/', authenticateToken, updateCurrentUserProfile);

export default router;
