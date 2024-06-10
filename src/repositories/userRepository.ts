import cuid from 'cuid';

import pool from '../config/db';
import { User } from '../models/User';

const verifyUserExistsById = async (id: string): Promise<boolean> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
        id,
    ]);
    return rows.length > 0;
};

const verifyUserExistsByUsername = async (
    username: string,
): Promise<boolean> => {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
    );
    return rows.length > 0;
};

const verifyUserExistsByEmail = async (email: string): Promise<boolean> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
    ]);
    return rows.length > 0;
};

const getUserByIdFromDb = async (id: string): Promise<User | null> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
        id,
    ]);
    return rows[0] || null;
};

const getUserByEmailFromDb = async (email: string): Promise<User | null> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
    ]);
    return rows[0] || null;
};

const getUserByUsernameFromDb = async (
    username: string,
): Promise<User | null> => {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
    );
    return rows[0] || null;
};

const createUserInDb = async (
    username: string,
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user',
): Promise<User> => {
    const id = cuid();
    const { rows } = await pool.query(
        'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING*',
        [id, username, email, password, role],
    );
    return rows[0];
};

const updateCurrentUserProfileInDb = async (
    id: string,
    username: string,
    email: string,
): Promise<User | null> => {
    const { rows } = await pool.query(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING*',
        [username, email, id],
    );
    return rows[0] || null;
};

export {
    verifyUserExistsById,
    verifyUserExistsByUsername,
    verifyUserExistsByEmail,
    getUserByIdFromDb,
    getUserByEmailFromDb,
    getUserByUsernameFromDb,
    createUserInDb,
    updateCurrentUserProfileInDb,
};
