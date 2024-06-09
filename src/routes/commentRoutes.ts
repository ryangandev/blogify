import Router from 'express';

import {
    authenticateToken,
    authorizeRoles,
} from '../middleware/authMiddleware';
import {
    createComment,
    getFirstLevelCommentsByPostId,
    getNextLevelCommentsByParentId,
    updateComment,
    deleteComment,
} from '../controllers/commentController';

const router = Router();

// Create a new comment
router.post(
    '/create',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    createComment,
);

// Get all first-level comments for a post
router.get(
    '/:postId',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    getFirstLevelCommentsByPostId,
);

// Get next-level comments for a comment
router.get(
    '/:commentId/children',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    getNextLevelCommentsByParentId,
);

// Update a comment by ID
router.put(
    '/:commentId',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    updateComment,
);

// Delete a comment by ID
router.delete(
    '/:commentId',
    authenticateToken,
    authorizeRoles('admin'),
    deleteComment,
);

export default router;
