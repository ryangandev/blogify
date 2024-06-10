import express, { json } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorHandlerMiddleware';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import tagRoutes from './routes/tagRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(json({ limit: '1kb' }));
app.use(cookieParser()); // Parse cookies
app.use(logger); // Log requests
app.use(errorHandler); // Handle errors

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
