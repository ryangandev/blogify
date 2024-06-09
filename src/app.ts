import express, { json } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(json({ limit: '1kb' }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
