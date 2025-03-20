
import { useState, useEffect } from 'react';
import { Video } from '@/components/VideoGrid';

// Demo video data
const demoVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript in this comprehensive tutorial for beginners.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2574&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: '12:34',
    createdAt: '2023-01-15T10:20:30Z'
  },
  {
    id: '2',
    title: 'Modern UI Design Principles',
    description: 'Discover the key principles of modern user interface design that will elevate your products.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: '08:12',
    createdAt: '2023-02-20T14:15:10Z'
  },
  {
    id: '3',
    title: 'Responsive Design Techniques',
    description: 'Master responsive design with these essential techniques to create websites that work on any device.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: '15:47',
    createdAt: '2023-03-05T09:30:45Z'
  },
  {
    id: '4',
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into advanced JavaScript concepts like closures, prototypes, and asynchronous programming.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: '21:09',
    createdAt: '2023-04-10T16:20:15Z'
  },
  {
    id: '5',
    title: 'UX Research Methods',
    description: 'Learn effective user experience research methods to better understand your users and their needs.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2670&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: '18:26',
    createdAt: '2023-05-22T11:40:30Z'
  },
  {
    id: '6',
    title: 'Frontend Performance Optimization',
    description: 'Discover techniques to optimize your frontend code for maximum performance and user satisfaction.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?q=80&w=2670&auto=format&fit=crop',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: '14:52',
    createdAt: '2023-06-15T13:25:40Z'
  }
];

// Store key for localStorage
const VIDEOS_STORAGE_KEY = 'streamhub_videos';

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load videos from localStorage or use demo data
  useEffect(() => {
    const loadVideos = () => {
      setIsLoading(true);
      try {
        const storedVideos = localStorage.getItem(VIDEOS_STORAGE_KEY);
        if (storedVideos) {
          setVideos(JSON.parse(storedVideos));
        } else {
          // Use demo data for first load
          setVideos(demoVideos);
          // Save demo data to localStorage
          localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(demoVideos));
        }
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos');
        // Fallback to demo data
        setVideos(demoVideos);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideos();
  }, []);
  
  // Add a new video
  const addVideo = (video: Video) => {
    try {
      const updatedVideos = [video, ...videos];
      setVideos(updatedVideos);
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
      return true;
    } catch (err) {
      console.error('Error adding video:', err);
      setError('Failed to add video');
      return false;
    }
  };
  
  // Get a single video by ID
  const getVideo = (id: string) => {
    return videos.find(video => video.id === id) || null;
  };
  
  // Delete a video by ID
  const deleteVideo = (id: string) => {
    try {
      const updatedVideos = videos.filter(video => video.id !== id);
      setVideos(updatedVideos);
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos));
      return true;
    } catch (err) {
      console.error('Error deleting video:', err);
      setError('Failed to delete video');
      return false;
    }
  };
  
  return {
    videos,
    isLoading,
    error,
    addVideo,
    getVideo,
    deleteVideo
  };
};
