import pool from "../config/db";

const getUsers = async () => {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
};

const createUser = async (
    username: string,
    email: string,
    password: string
) => {
    const { rows } = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING*",
        [username, email, password]
    );
    return rows;
};

export { getUsers, createUser };
