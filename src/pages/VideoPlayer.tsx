
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VideoPlayerComponent from '@/components/VideoPlayer';
import { useVideos } from '@/hooks/useVideos';
import VideoGrid from '@/components/VideoGrid';
import { fadeInUp, slideUp } from '@/utils/animations';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoPlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVideo, videos } = useVideos();
  
  const video = getVideo(id || '');
  const relatedVideos = videos.filter(v => v.id !== id).slice(0, 4);
  
  useEffect(() => {
    if (!video) {
      // Redirect to home if video not found
      navigate('/', { replace: true });
    }
  }, [video, navigate]);
  
  if (!video) {
    return null;
  }
  
  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-muted-foreground mb-4"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 ${fadeInUp()}`}>
            <div className="rounded-xl overflow-hidden mb-4">
              <VideoPlayerComponent 
                videoUrl={video.videoUrl} 
                title={video.title}
                autoPlay={true}
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-medium">{video.title}</h1>
              <p className="text-muted-foreground">{video.description}</p>
            </div>
          </div>
          
          <div className={slideUp(1)}>
            <h2 className="text-xl font-medium mb-4">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo, index) => (
                <div 
                  key={relatedVideo.id}
                  className={fadeInUp(index + 1)}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <VideoGrid videos={[relatedVideo]} className="grid-cols-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayerPage;
