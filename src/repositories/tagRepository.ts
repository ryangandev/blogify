import cuid from 'cuid';

import pool from '../config/db';
import { Tag, TaggedPost } from '../models/Tag';

const createTagInDb = async (name: string): Promise<Tag> => {
    const id = cuid();
    const { rows } = await pool.query(
        'INSERT INTO tags (id, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING*',
        [id, name],
    );
    return rows[0];
};

const getAllTagsFromDb = async (): Promise<Tag[]> => {
    const { rows } = await pool.query('SELECT * FROM tags ORDER BY name ASC');
    return rows;
};

const updateTagInDb = async (id: string, name: string): Promise<Tag | null> => {
    const { rows } = await pool.query(
        'UPDATE tags SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING*',
        [name, id],
    );
    return rows[0] || null;
};

const deleteTagFromDb = async (id: string): Promise<boolean> => {
    const { rowCount } = await pool.query('DELETE FROM tags WHERE id = $1', [
        id,
    ]);

    if (rowCount === null) {
        return false;
    }
    return rowCount > 0;
};

const addTagToPostInDb = async (
    postId: string,
    tagId: string,
): Promise<TaggedPost> => {
    const { rows } = await pool.query(
        'INSERT INTO tagged_posts (post_id, tag_id) VALUES ($1, $2) RETURNING*',
        [postId, tagId],
    );
    return rows[0];
};

const removeTagFromPostInDb = async (
    postId: string,
    tagId: string,
): Promise<boolean> => {
    const { rowCount } = await pool.query(
        'DELETE FROM tagged_posts WHERE post_id = $1 AND tag_id = $2',
        [postId, tagId],
    );

    if (rowCount === null) {
        return false;
    }
    return rowCount > 0;
};

const getTagsForPostFromDb = async (postId: string): Promise<string[]> => {
    const { rows } = await pool.query(
        'SELECT tag_id from tagged_posts WHERE post_id = $1',
        [postId],
    );
    return rows.map((row) => row.tag_id);
};

export {
    createTagInDb,
    getAllTagsFromDb,
    updateTagInDb,
    deleteTagFromDb,
    addTagToPostInDb,
    removeTagFromPostInDb,
    getTagsForPostFromDb,
};
