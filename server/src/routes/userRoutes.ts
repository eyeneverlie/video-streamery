
import express from 'express';
import { 
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// User routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
