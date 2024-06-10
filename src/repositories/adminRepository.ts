import pool from '../config/db';

import { User } from '../models/User';
import { Post } from '../models/Post';

const getAllUsersFromDb = async (): Promise<User[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM users ORDER BY created_at DESC',
    );
    return rows;
};

const getAllPostsFromDb = async (): Promise<Post[]> => {
    const { rows } = await pool.query(
        'SELECT * FROM posts ORDER BY created_at DESC',
    );
    return rows;
};

const deleteUserFromDb = async (id: string): Promise<boolean> => {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [
        id,
    ]);

    if (rowCount === null) {
        return false;
    }
    return rowCount > 0;
};

const deletePostFromDb = async (id: string): Promise<boolean> => {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [
        id,
    ]);

    if (rowCount === null) {
        return false;
    }
    return rowCount > 0;
};

export {
    getAllUsersFromDb,
    getAllPostsFromDb,
    deleteUserFromDb,
    deletePostFromDb,
};
