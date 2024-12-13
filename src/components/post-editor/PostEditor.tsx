import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Image, Paperclip, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";

export const PostEditor = () => {
  const [date, setDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Create Post</h2>
      
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
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Image className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          <Button variant="outline" size="sm">
            <Paperclip className="mr-2 h-4 w-4" />
            Attach File
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Schedule"}
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
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};