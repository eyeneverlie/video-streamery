
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VideoUpload from '@/components/VideoUpload';
import { useVideos } from '@/hooks/useVideos';
import { fadeInUp, slideUp } from '@/utils/animations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Trash2, Upload, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Video } from '@/components/VideoGrid';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { videos, addVideo, deleteVideo } = useVideos();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!adminLoggedIn) {
      navigate('/admin');
      return;
    }
    setIsLoggedIn(true);
  }, [navigate]);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/admin');
  };
  
  // Handle video upload
  const handleUploadComplete = (video: Video) => {
    const success = addVideo(video);
    if (success) {
      toast({
        title: "Video uploaded",
        description: "The video has been added to your library"
      });
    }
  };
  
  // Handle video deletion
  const handleDeleteVideo = () => {
    if (videoToDelete) {
      const success = deleteVideo(videoToDelete);
      if (success) {
        toast({
          title: "Video deleted",
          description: "The video has been removed from your library"
        });
      }
      setVideoToDelete(null);
    }
  };
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 pt-24 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className={fadeInUp()}>
            <h1 className="text-3xl font-medium">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your videos and upload new content
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className={fadeInUp(1)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="videos" className={slideUp(1)}>
          <TabsList className="mb-8">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className={fadeInUp(2)}>
            <div className="glass-panel rounded-xl overflow-hidden">
              {videos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thumbnail</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Duration</TableHead>
                      <TableHead className="hidden md:table-cell">Date Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <div className="w-20 h-12 rounded overflow-hidden">
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium truncate max-w-[200px]">
                          {video.title}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{video.duration}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/video/${video.id}`}>
                              <Button size="icon" variant="ghost">
                                <Play className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => setVideoToDelete(video.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{video.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteVideo}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No videos yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first video to get started
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => {
                      const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
                      if (uploadTab) uploadTab.click();
                    }}
                  >
                    Upload Video
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className={fadeInUp(2)}>
            <VideoUpload onUploadComplete={handleUploadComplete} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
