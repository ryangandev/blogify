import { Router } from 'express';

import {
    authenticateToken,
    authorizeRoles,
} from '../middleware/authMiddleware';
import {
    createPost,
    getPosts,
    getUserPosts,
    getPostById,
    updatePost,
    deletePost,
    searchPosts,
} from '../controllers/postController';

const router = Router();

// Create a new post
router.post(
    '/create',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    createPost,
);

// Get all posts
router.get('/', getPosts);

// Get all posts for the current user
router.get('/me', authenticateToken, getUserPosts);

// Search posts
router.get('/search', searchPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Update a post by ID
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    updatePost,
);

// Delete a post by ID
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deletePost);

export default router;
