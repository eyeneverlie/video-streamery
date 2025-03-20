
import express from 'express';
import multer from 'multer';
import {
  uploadVideo,
  getVideos,
  getVideoById,
  deleteVideo
} from '../controllers/videoController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Video routes
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/', protect, admin, upload.single('video'), uploadVideo);
router.delete('/:id', protect, admin, deleteVideo);

export default router;
