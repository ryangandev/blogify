DROP TABLE IF EXISTS tagged_posts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(25) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(25) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    id VARCHAR(25) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(25) NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id VARCHAR(25) PRIMARY KEY,
    post_id VARCHAR(25) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id VARCHAR(25) REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    has_children BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
    id VARCHAR(25) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tagged_posts (
    tag_id VARCHAR(25) REFERENCES tags(id) ON DELETE CASCADE,
    post_id VARCHAR(25) REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);