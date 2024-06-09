import { Request, Response } from 'express';

import { tagSchema } from '../schemas/tagSchema';
import {
    createTagInDb,
    getAllTagsFromDb,
    updateTagInDb,
    deleteTagFromDb,
    addTagToPostInDb,
    removeTagFromPostInDb,
    getTagsForPostFromDb,
} from '../repositories/tagRepository';

const createTag = async (req: Request, res: Response) => {
    try {
        const result = tagSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid name',
                errors: result.error.errors,
            });
        }

        const { name } = result.data;
        const newTag = await createTagInDb(name);
        return res.status(201).json(newTag);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllTags = async (req: Request, res: Response) => {
    try {
        const tags = await getAllTagsFromDb();
        return res.status(200).json(tags);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTag = async (req: Request, res: Response) => {
    try {
        const result = tagSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: 'Invalid name',
                errors: result.error.errors,
            });
        }

        const { tagId } = req.params;
        const { name } = result.data;
        const updatedTag = await updateTagInDb(tagId, name);
        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        return res.status(200).json(updatedTag);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTag = async (req: Request, res: Response) => {
    try {
        const { tagId } = req.params;
        const deleted = await deleteTagFromDb(tagId);
        if (!deleted) {
            return res.status(404).json({
                message: 'Tag not found',
            });
        }
        return res.status(200).json({
            message: 'Tag deleted successfully!',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const addTagToPost = async (req: Request, res: Response) => {
    try {
        const { postId, tagId } = req.body;
        const newTaggedPost = await addTagToPostInDb(postId, tagId);
        return res.status(201).json(newTaggedPost);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const removeTagFromPost = async (req: Request, res: Response) => {
    try {
        const { postId, tagId } = req.body;
        const removed = await removeTagFromPostInDb(postId, tagId);
        if (!removed) {
            return res.status(404).json({
                message: 'Tag not found on post',
            });
        }
        return res.status(200).json({
            message: 'Tag removed from post successfully!',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const getTagsForPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const tags = await getTagsForPostFromDb(postId);
        return res.status(200).json(tags);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    createTag,
    getAllTags,
    updateTag,
    deleteTag,
    addTagToPost,
    removeTagFromPost,
    getTagsForPost,
};
