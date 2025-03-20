
import React, { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  onUploadComplete: (videoData: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    createdAt: string;
  }) => void;
}

const VideoUpload = ({ onUploadComplete }: VideoUploadProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  // Handle video file selection
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid video file",
        variant: "destructive"
      });
    }
  };
  
  // Handle thumbnail file selection
  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file",
        variant: "destructive"
      });
    }
  };
  
  // Simulate upload process
  const handleUpload = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the video",
        variant: "destructive"
      });
      return;
    }
    
    if (!videoFile) {
      toast({
        title: "Video required",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!thumbnailFile) {
      toast({
        title: "Thumbnail required",
        description: "Please select a thumbnail image",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // In a real app, we would get these URLs from the server
          // For demo purposes, we're using local URLs
          const videoUrl = URL.createObjectURL(videoFile);
          const thumbnailUrl = thumbnailPreview || '';
          
          // Generate a unique ID
          const id = Date.now().toString();
          
          // Calculate duration (mock)
          const minutes = Math.floor(Math.random() * 10) + 1;
          const seconds = Math.floor(Math.random() * 60);
          const duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          
          // Complete the upload
          setTimeout(() => {
            onUploadComplete({
              id,
              title,
              description,
              thumbnailUrl,
              videoUrl,
              duration,
              createdAt: new Date().toISOString()
            });
            
            setIsUploading(false);
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnailFile(null);
            setThumbnailPreview(null);
            
            toast({
              title: "Upload complete",
              description: "Your video has been uploaded successfully"
            });
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 glass-panel rounded-xl">
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-semibold">Upload New Video</h2>
        <p className="text-muted-foreground">
          Fill in the details and upload your video file
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter video title"
            disabled={isUploading}
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter video description"
            className="min-h-[100px] resize-none"
            disabled={isUploading}
          />
        </div>
        
        {/* Thumbnail upload */}
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-4 transition-colors hover:bg-muted/50 cursor-pointer",
              thumbnailPreview ? "border-primary/50" : "border-muted-foreground/25"
            )}
            onClick={() => thumbnailInputRef.current?.click()}
          >
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
              disabled={isUploading}
            />
            
            {thumbnailPreview ? (
              <div className="relative aspect-video">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnailPreview(null);
                    setThumbnailFile(null);
                  }}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm text-center">
                  Click to upload thumbnail image
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Recommended: 16:9 aspect ratio, JPG or PNG
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Video upload */}
        <div className="space-y-2">
          <Label>Video</Label>
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-4 transition-colors hover:bg-muted/50",
              videoFile ? "border-primary/50" : "border-muted-foreground/25",
              !isUploading && "cursor-pointer"
            )}
            onClick={() => !isUploading && videoInputRef.current?.click()}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">Uploading video...</p>
                  <p className="text-sm font-medium">{Math.round(uploadProgress)}%</p>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            ) : videoFile ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">
                      {videoFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm text-center">
                  Click to upload video file
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Supported formats: MP4, WebM, MOV, AVI
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upload button */}
        <Button 
          type="button" 
          className="w-full"
          disabled={isUploading || !title || !videoFile || !thumbnailFile}
          onClick={handleUpload}
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </Button>
      </div>
    </div>
  );
};

export default VideoUpload;
