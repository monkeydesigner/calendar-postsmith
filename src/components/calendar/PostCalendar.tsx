import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Post } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonthDays, formatDate, isSameDay } from "@/utils/date";
import { PostEditor } from "../post-editor/PostEditor";
import { useToast } from "../ui/use-toast";

interface CalendarProps {
  view: "day" | "week" | "month";
}

export const Calendar = ({ view: initialView }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(initialView);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("scheduled_at", { ascending: true });
      
      if (error) throw error;
      
      return (data as any[]).map(post => ({
        ...post,
        attachments: Array.isArray(post.attachments) ? post.attachments : []
      })) as Post[];
    },
  });

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDayPosts = (day: Date) => {
    if (!posts) return [];
    return posts.filter(post => post.scheduled_at && 
      isSameDay(new Date(post.scheduled_at), day));
  };

  const days = getMonthDays(currentDate);
  const today = new Date();

  return (
    <div className="w-full rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">
            {formatDate(currentDate)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof initialView)}>
            <TabsList>
              <TabsTrigger value="day">Daily</TabsTrigger>
              <TabsTrigger value="week">Weekly</TabsTrigger>
              <TabsTrigger value="month">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>

          <Sheet open={isAddingPost} onOpenChange={setIsAddingPost}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </SheetTrigger>
            <SheetContent>
              <PostEditor onClose={() => setIsAddingPost(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">Loading posts...</div>
      ) : (
        <div className="grid grid-cols-7 gap-px bg-muted p-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="bg-background p-2 text-center font-medium"
            >
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayPosts = getDayPosts(day);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={index}
                className={`bg-background p-2 min-h-[120px] ${
                  isCurrentMonth ? "" : "text-muted-foreground"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div className="font-medium mb-1">{day.getDate()}</div>
                <div className="space-y-1">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="text-xs p-1 rounded bg-primary/10 truncate"
                    >
                      {post.title || "Untitled Post"}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};