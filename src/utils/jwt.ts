import jwt from 'jsonwebtoken';

import { tokenData } from '../models/token';

const generateJwtToken = (data: tokenData) => {
    const token = jwt.sign(data, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
    });
    return token;
};

const verifyJwtToken = (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
};

export { generateJwtToken, verifyJwtToken };
