import Router from 'express';
import { registerUser, loginUser } from '../controllers/userController';

// Setup router middleware
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
