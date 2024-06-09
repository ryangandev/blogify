import cuid from 'cuid';

import pool from '../config/db';
import { User } from '../models/User';

const getUsers = async (): Promise<User[]> => {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
};

const getUserById = async (id: string): Promise<User> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
        id,
    ]);
    return rows[0] || null;
};

const getUserByEmail = async (email: string): Promise<User> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
    ]);
    return rows[0] || null;
};

const getUserByUsername = async (username: string): Promise<User> => {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
    );
    return rows[0] || null;
};

const createUser = async (
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

export { getUsers, getUserById, getUserByEmail, getUserByUsername, createUser };
