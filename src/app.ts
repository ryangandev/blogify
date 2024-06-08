import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

// Middleware
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
