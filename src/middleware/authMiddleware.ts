import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import { verifyJwtToken } from '../utils/jwt';

const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    // Extract token from cookies or Authorization header
    const token =
        req.cookies.token || req.headers['authorization']?.split(' ')[1];

    // Check if token exists
    if (!token) {
        return res
            .status(401)
            .json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = verifyJwtToken(token);
        req.user = decoded; // Attach user object to request
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Check if user has required role
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You are not authorized to access this resource',
            });
        }
        next();
    };
};

export type { AuthenticatedRequest };
export { authenticateToken, authorizeRoles };
