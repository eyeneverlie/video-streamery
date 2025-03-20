
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VideoGrid from '@/components/VideoGrid';
import { useVideos } from '@/hooks/useVideos';
import { fadeInUp } from '@/utils/animations';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Index = () => {
  const { videos, isLoading } = useVideos();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(videos);
  
  // Filter videos based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = videos.filter(
        video => 
          video.title.toLowerCase().includes(query) || 
          video.description.toLowerCase().includes(query)
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <section className={fadeInUp()}>
          <h1 className="text-4xl font-medium tracking-tight mb-2">
            StreamHub
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover amazing videos
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-2xl mb-12">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search videos..."
              className="pl-10 h-12 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index} 
                  className="rounded-xl glass-panel animate-pulse"
                >
                  <div className="aspect-video bg-muted rounded-t-xl"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredVideos.length > 0 ? (
                <VideoGrid videos={filteredVideos} />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No videos found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
