import Router from 'express';

import {
    authenticateToken,
    authorizeRoles,
} from '../middleware/authMiddleware';
import {
    createTag,
    getAllTags,
    updateTag,
    deleteTag,
    addTagToPost,
    removeTagFromPost,
    getTagsForPost,
} from '../controllers/tagController';
import { verifyAuthor } from '../middleware/verifyAuthorMiddleware';

const router = Router();

// Create a new tag
router.post(
    '/create',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    createTag,
);

// Get all tags
router.get('/', getAllTags);

// Update a tag
router.put('/:tagId', authenticateToken, authorizeRoles('admin'), updateTag);

// Delete a tag
router.delete('/:tagId', authenticateToken, authorizeRoles('admin'), deleteTag);

// Add a tag to a post
router.post(
    '/add',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    verifyAuthor,
    addTagToPost,
);

// Remove a tag from a post
router.post(
    '/remove',
    authenticateToken,
    authorizeRoles('admin', 'user'),
    verifyAuthor,
    removeTagFromPost,
);

// Get tags for a post
router.get('/:postId', getTagsForPost);

export default router;
