
import React from 'react';
import VideoCard from './VideoCard';
import { cn } from '@/lib/utils';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  createdAt: string;
}

interface VideoGridProps {
  videos: Video[];
  className?: string;
}

const VideoGrid = ({ videos, className }: VideoGridProps) => {
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No videos found
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          description={video.description}
          thumbnailUrl={video.thumbnailUrl}
          duration={video.duration}
          index={index}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
