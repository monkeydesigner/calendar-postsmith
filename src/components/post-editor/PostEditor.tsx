import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PostAction } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const PostEditor = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postAction, setPostAction] = useState<PostAction>("now");
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast({
      title: "Files added",
      description: `Added ${acceptedFiles.length} files`
    });
  }, [toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      onDrop(selectedFiles);
    }
  };

  const handleSave = async () => {
    if (postAction === "schedule" && !date) {
      toast({
        title: "Error",
        description: "Please select a date to schedule the post",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement LinkedIn API integration
    toast({
      title: postAction === "now" ? "Post published" : "Post scheduled",
      description: postAction === "now" 
        ? "Your post has been published to LinkedIn" 
        : `Your post will be published on ${format(date!, "PPP")} at ${time}`
    });
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Create LinkedIn Post</h2>
      
      <div className="space-y-4">
        <Input
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <Textarea
          placeholder="Write your post content..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div 
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-muted-foreground">
            Drag 'n' drop some files here, or click to select files
          </p>
          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="text-sm text-muted-foreground">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <RadioGroup
            defaultValue="now"
            onValueChange={(value) => setPostAction(value as PostAction)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now">Post Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="schedule" id="schedule" />
              <Label htmlFor="schedule">Schedule</Label>
            </div>
          </RadioGroup>

          {postAction === "schedule" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-[120px]"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" type="button">
            Save as Template
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {postAction === "now" ? "Post Now" : "Schedule Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};