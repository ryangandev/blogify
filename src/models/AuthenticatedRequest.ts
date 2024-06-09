import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export type { AuthenticatedRequest };
