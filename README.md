# Blogify

## 🚀 About

Blogify is a simple RESTful blog platform API.

## 📌 Features

-   User Authentication
-   Blog Post Management
-   Comment Management
-   Tag Management
-   User Profile Management
-   Admin Dashboard

## ⚙️ Technologies Used

-   Node.js
-   Express.js
-   TypeScript
-   PostgreSQL
-   JWT for authentication
-   Jest for testing

## 🛠️ Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ryangandev/blogify.git
    cd blogify
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the environment variables. Create a `.env` file in the root directory with the following content:

    ```env
    PORT=3000
    HOST=localhost
    PROTOCOL=http

    DB_USER=your_db_user
    DB_HOST=localhost
    DB_NAME=your_db_name
    DB_PORT=5432

    JWT_SECRET=your_jwt_secret
    ```

4. Run database migrations:

    ```bash
    psql -d your_db_name -f src/sql/setup.sql
    ```

5. Start the server:
    ```bash
    npm run dev
    ```

## Running Tests

To run tests, use the following command:

```bash
npm test
```

## API Documentation

### Authentication

-   POST /api/auth/register: Register a new user

-   POST /api/auth/login: Login a user

### Users

-   GET /api/auth/me: Get current user profile

-   GET /api/auth/username/:username: Get user profile by username

-   GET /api/auth/userId/:userId: Get user profile by ID

-   PUT /api/auth: Update current user profile

### Posts

-   POST /api/posts: Create a new post

-   GET /api/posts: Get all posts with pagination and sorting

-   GET /api/posts/me: Get all posts from the current user with pagination and sorting

-   GET /api/posts/:id: Get a post by ID

-   GET /api/posts/search: Get searched posts with query

-   PUT /api/posts/:id: Update a post by ID

-   DELETE /api/posts/:id: Delete a post by ID

### Comments

-   POST /api/comments: Create a new comment

-   GET /api/comments/:postId: Get first-level comments for a post

-   GET /api/comments/:commentId/children: Get next-level comments for a comment

-   PUT /api/comments/:id: Update a comment by ID

-   DELETE /api/comments/:id: Delete a comment by ID

### Tags

-   POST /api/tags/create: Create a new tag

-   GET /api/tags: Get all tags

-   PUT /api/tags/:id: Update a tag by ID

-   DELETE /api/tags/:id: Delete a tag by ID

-   POST /api/tags/add: Add a tag to a post

-   POST /api/tags/remove: Remove a tag from a post

-   GET /api/tags/:postId: Get all tags from a post

### Admin

-   GET /api/admin/users: Get all users

-   GET /api/admin/posts: Get all posts

-   DELETE /api/admin/users/:id: Delete a user by ID

-   DELETE /api/admin/posts/:id: Delete a post by ID
