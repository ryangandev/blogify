import cuid from 'cuid';

import pool from '../config/db';
import { Post } from '../models/Post';

const createPostInDb = async (
    title: string,
    content: string,
    authorId: string,
): Promise<Post> => {
    const id = cuid();
    const { rows } = await pool.query(
        'INSERT INTO posts (id, title, content, author_id) VALUES ($1, $2, $3, $4) RETURNING*',
        [id, title, content, authorId],
    );
    return rows[0];
};

const getPostsFromDb = async (
    page: number,
    limit: number,
    sortBy: string,
    order: string,
): Promise<Post[]> => {
    const offset = (page - 1) * limit;
    const validSortColumns = ['title', 'created_at', 'updated_at'];
    const validOrderDirections = ['ASC', 'DESC'];

    if (!validSortColumns.includes(sortBy)) {
        sortBy = 'created_at';
    }
    if (!validOrderDirections.includes(order.toUpperCase())) {
        order = 'DESC';
    }

    const { rows } = await pool.query(
        `SELECT * FROM posts ORDER BY ${sortBy} ${order.toUpperCase()} LIMIT $1 OFFSET $2`,
        [limit, offset],
    ); // sortBy and order are not user inputs so used as template literals; limit and offset are user inputs so used as parameterized query
    return rows;
};

const getUserPostsFromDb = async (
    userId: string,
    page: number,
    limit: number,
): Promise<Post[]> => {
    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
        `SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset],
    );
    return rows;
};

const getPostByIdFromDb = async (id: string): Promise<Post | null> => {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [
        id,
    ]);
    return rows[0] || null;
};

const updatePostByIdInDb = async (
    id: string,
    title: string,
    content: string,
    authorId: string,
): Promise<Post | null> => {
    const { rows } = await pool.query(
        'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND author_id = $4 RETURNING*',
        [title, content, id, authorId],
    );
    return rows[0] || null;
};

const deletePostByIdFromDb = async (id: string): Promise<boolean> => {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [
        id,
    ]);

    if (rowCount === null) {
        return false;
    }

    return rowCount > 0;
};

const searchPostsFromDb = async (query: string): Promise<Post[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1',
        [`%${query}%`],
    );
    return rows;
};

const getAuthorIdByPostIdFromDb = async (
    postId: string,
): Promise<string | null> => {
    const { rows } = await pool.query(
        'SELECT author_id FROM posts WHERE id = $1',
        [postId],
    );
    return rows[0]?.author_id || null;
};

export {
    createPostInDb,
    getPostsFromDb,
    getUserPostsFromDb,
    getPostByIdFromDb,
    updatePostByIdInDb,
    deletePostByIdFromDb,
    searchPostsFromDb,
    getAuthorIdByPostIdFromDb,
};
