import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Post } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CalendarProps {
  view: "day" | "week" | "month";
}

export const Calendar = ({ view }: CalendarProps) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("scheduled_at", { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match the Post type
      return (data as any[]).map(post => ({
        ...post,
        attachments: Array.isArray(post.attachments) ? post.attachments : []
      })) as Post[];
    },
  });

  return (
    <div className="rounded-lg border bg-card p-4">
      <CalendarComponent
        mode="single"
        className="w-full"
        selected={new Date()}
        onSelect={(date) => console.log(date)}
      />
      {isLoading && <div>Loading posts...</div>}
    </div>
  );
};