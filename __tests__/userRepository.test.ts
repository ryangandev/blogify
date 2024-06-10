import pool from '../src/config/db';
import {
    verifyUserExistsById,
    verifyUserExistsByUsername,
    verifyUserExistsByEmail,
    getUserByIdFromDb,
    getUserByEmailFromDb,
    getUserByUsernameFromDb,
    createUserInDb,
    updateCurrentUserProfileInDb,
} from '../src/repositories/userRepository';
import { User } from '../src/models/User';

jest.mock('../src/config/db');

describe('User Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should verify if user exists by ID', async () => {
        (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: '1' }] });

        const exists = await verifyUserExistsById('1');
        expect(exists).toBe(true);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE id = $1',
            ['1'],
        );
    });

    it('should verify if user exists by username', async () => {
        (pool.query as jest.Mock).mockResolvedValue({
            rows: [{ id: '1', username: 'testuser' }],
        });

        const exists = await verifyUserExistsByUsername('testuser');
        expect(exists).toBe(true);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE username = $1',
            ['testuser'],
        );
    });

    it('should verify if user exists by email', async () => {
        (pool.query as jest.Mock).mockResolvedValue({
            rows: [{ id: '1', email: 'testuser@example.com' }],
        });

        const exists = await verifyUserExistsByEmail('testuser@example.com');
        expect(exists).toBe(true);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            ['testuser@example.com'],
        );
    });

    it('should get user by ID', async () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

        const user = await getUserByIdFromDb('1');
        expect(user).toEqual(mockUser);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE id = $1',
            ['1'],
        );
    });

    it('should get user by email', async () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

        const user = await getUserByEmailFromDb('testuser@example.com');
        expect(user).toEqual(mockUser);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE email = $1',
            ['testuser@example.com'],
        );
    });

    it('should get user by username', async () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

        const user = await getUserByUsernameFromDb('testuser');
        expect(user).toEqual(mockUser);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT * FROM users WHERE username = $1',
            ['testuser'],
        );
    });

    it('should create a new user in the database', async () => {
        const mockUser: User = {
            id: '1',
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

        const newUser = await createUserInDb(
            'newuser',
            'newuser@example.com',
            'password',
            'user',
        );
        expect(newUser).toEqual(mockUser);
        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING*',
            [
                expect.any(String),
                'newuser',
                'newuser@example.com',
                'password',
                'user',
            ],
        );
    });

    it('should update user profile in the database', async () => {
        const mockUser: User = {
            id: '1',
            username: 'updateduser',
            email: 'updateduser@example.com',
            password: 'password',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

        const updatedUser = await updateCurrentUserProfileInDb(
            '1',
            'updateduser',
            'updateduser@example.com',
        );
        expect(updatedUser).toEqual(mockUser);
        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING*',
            ['updateduser', 'updateduser@example.com', '1'],
        );
    });
});
