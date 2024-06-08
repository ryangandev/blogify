import dotenv from 'dotenv';

import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const PROTOCOL = process.env.PROTOCOL || 'http';

app.listen(PORT, () => {
    console.log(
        `Server is running! Check out: \n${PROTOCOL}://${HOST}:${PORT}/`,
    );
});
