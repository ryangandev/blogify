import cuid from 'cuid';

import pool from '../config/db';

const getUsers = async () => {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
};

const createUser = async (
    username: string,
    email: string,
    password: string,
) => {
    const id = cuid();
    const { rows } = await pool.query(
        'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING*',
        [id, username, email, password],
    );
    return rows;
};

export { getUsers, createUser };
