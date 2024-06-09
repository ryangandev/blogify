import { Response, Router } from 'express';

import { AuthenticatedRequest } from '../models/AuthenticatedRequest';
import {
    authenticateToken,
    authorizeRoles,
} from '../middleware/authMiddleware';

const router = Router();

router.get(
    '/protected',
    authenticateToken,
    (req: AuthenticatedRequest, res: Response) => {
        res.status(200).json({
            message: 'This is a protected route',
            user: req.user,
        });
    },
);

router.get(
    '/admin',
    authenticateToken,
    authorizeRoles('admin'),
    (req: AuthenticatedRequest, res: Response) => {
        res.status(200).json({
            message: 'This is an admin-only route',
            user: req.user,
        });
    },
);

export default router;
