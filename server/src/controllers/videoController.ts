
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { AuthRequest } from '../middleware/auth';
import Video from '../models/Video';

// @desc    Upload a video
// @route   POST /api/videos
// @access  Private/Admin
export const uploadVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      res.status(400).json({ message: 'Please upload a video file' });
      return;
    }

    // Create a unique file name
    const uniqueFilename = `${Date.now()}-${path.basename(videoFile.originalname)}`;
    const videoPath = path.join(__dirname, '../../uploads/videos', uniqueFilename);
    const thumbnailPath = path.join(__dirname, '../../uploads/thumbnails', `${uniqueFilename.split('.')[0]}.jpg`);
    
    // Ensure directories exist
    if (!fs.existsSync(path.join(__dirname, '../../uploads/videos'))) {
      fs.mkdirSync(path.join(__dirname, '../../uploads/videos'), { recursive: true });
    }
    if (!fs.existsSync(path.join(__dirname, '../../uploads/thumbnails'))) {
      fs.mkdirSync(path.join(__dirname, '../../uploads/thumbnails'), { recursive: true });
    }

    // Move the file to the uploads directory
    fs.writeFileSync(videoPath, videoFile.buffer);

    // Generate thumbnail and get duration
    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        folder: path.join(__dirname, '../../uploads/thumbnails'),
        filename: `${uniqueFilename.split('.')[0]}.jpg`,
        size: '320x240',
      })
      .ffprobe((err, metadata) => {
        if (err) {
          res.status(500).json({ message: 'Error generating video metadata' });
          return;
        }

        const duration = metadata.format.duration ?? 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const durationStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Create video in DB
        const video = new Video({
          title,
          description,
          videoUrl: `/uploads/videos/${uniqueFilename}`,
          thumbnailUrl: `/uploads/thumbnails/${uniqueFilename.split('.')[0]}.jpg`,
          duration: durationStr,
          user: req.user._id,
        });

        video.save()
          .then((savedVideo) => {
            res.status(201).json(savedVideo);
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);

    if (video) {
      // Increment view count
      video.views += 1;
      await video.save();
      
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    // Delete the video and thumbnail files
    const videoPath = path.join(__dirname, '../..', video.videoUrl);
    const thumbnailPath = path.join(__dirname, '../..', video.thumbnailUrl);

    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    // Delete from database
    await video.deleteOne();
    res.json({ message: 'Video removed' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
