
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock, Play } from 'lucide-react';

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  className?: string;
  index?: number;
}

const VideoCard = ({
  id,
  title,
  description,
  thumbnailUrl,
  duration,
  className,
  index = 0
}: VideoCardProps) => {
  return (
    <Link 
      to={`/video/${id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl hover-card glass-panel animate-scale-in",
        index > 0 && `animation-delay-${(index % 5) * 200}`,
        className
      )}
    >
      <div className="video-container">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Play className="h-8 w-8 text-white" fill="white" />
          </div>
        </div>
        <Badge variant="secondary" className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white border-none">
          <Clock className="h-3 w-3" />
          <span>{duration}</span>
        </Badge>
      </div>
      <div className="flex flex-col p-4">
        <h3 className="font-medium text-base md:text-lg line-clamp-1 text-balance">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
};

export default VideoCard;
