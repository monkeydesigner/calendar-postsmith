import { useState } from "react";
import { Calendar } from "@/components/calendar/PostCalendar";
import { PostEditor } from "@/components/post-editor/PostEditor";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ViewToggle } from "@/components/calendar/ViewToggle";
import { CalendarView } from "@/types/calendar";

const Index = () => {
  const [view, setView] = useState<CalendarView>("week");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">LinkedIn Post Calendar</h1>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <ThemeToggle />
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="order-2 lg:order-1">
            <Calendar view={view} />
          </div>
          <div className="order-1 lg:order-2">
            <PostEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;