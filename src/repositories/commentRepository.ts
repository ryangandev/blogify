import cuid from 'cuid';

import pool from '../config/db';
import { Comment } from '../models/Comment';

const createCommentInDb = async (
    postId: string,
    authorId: string,
    content: string,
    parentId: string | undefined,
): Promise<Comment> => {
    const client = await pool.connect();
    try {
        // Start a transaction
        await client.query('BEGIN');

        // Create a new comment
        const id = cuid();
        const { rows } = await client.query(
            'INSERT INTO comments (id, post_id, author_id, content, parent_id, has_children, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING*',
            [id, postId, authorId, content, parentId || null, false],
        );
        const newComment = rows[0];

        // If parentId is provided, update the parent comment's has_children property to true
        if (parentId) {
            await client.query(
                'UPDATE comments SET has_children = TRUE WHERE id = $1',
                [parentId],
            );
        }

        await client.query('COMMIT');
        return newComment;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getFirstLevelCommentsByPostIdFromDb = async (
    postId: string,
    page: number,
    limit: number,
): Promise<Comment[]> => {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1 AND parent_id IS NULL ORDER BY created_at ASC LIMIT $2 OFFSET $3',
        [postId, limit, offset],
    );
    return rows;
};

const getNextLevelCommentsByParentIdFromDb = async (
    parentId: string,
    page: number,
    limit: number,
): Promise<Comment[]> => {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
        'SELECT * FROM comments WHERE parent_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3',
        [parentId, limit, offset],
    );
    return rows;
};

const updateCommentInDb = async (
    id: string,
    content: string,
    authorId: string,
): Promise<Comment | null> => {
    const { rows } = await pool.query(
        'UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 AND author_id = $3 RETURNING*',
        [content, id, authorId],
    );
    return rows[0] || null;
};

const deleteCommentFromDb = async (id: string): Promise<boolean> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Find the parentId of the comment being deleted
        const { rows } = await client.query(
            'SELECT parent_id FROM comments WHERE id = $1',
            [id],
        );
        const parentId = rows[0]?.parent_id;

        // Delete the comment
        const { rowCount } = await client.query(
            'DELETE FROM comments WHERE id = $1',
            [id],
        );

        // If the comment has a parent and was deleted, check if the parent still has children
        if (parentId) {
            const { rows: childRows } = await client.query(
                'SELECT COUNT(*) FROM comments WHERE parent_id = $1',
                [parentId],
            );
            const childCount = parseInt(childRows[0].count, 10);

            if (childCount === 0) {
                await client.query(
                    'UPDATE comments SET has_children = FALSE WHERE id = $1',
                    [parentId],
                );
            }
        }

        await client.query('COMMIT');

        if (rowCount === null) {
            return false;
        }
        return rowCount > 0;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export {
    createCommentInDb,
    getFirstLevelCommentsByPostIdFromDb,
    getNextLevelCommentsByParentIdFromDb,
    updateCommentInDb,
    deleteCommentFromDb,
};
