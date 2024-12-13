import { CalendarDays, CalendarRange, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/types/calendar";

interface ViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
      <Button
        variant={view === "day" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("day")}
      >
        <CalendarIcon className="h-4 w-4 mr-1" />
        Day
      </Button>
      <Button
        variant={view === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("week")}
      >
        <CalendarRange className="h-4 w-4 mr-1" />
        Week
      </Button>
      <Button
        variant={view === "month" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("month")}
      >
        <CalendarDays className="h-4 w-4 mr-1" />
        Month
      </Button>
    </div>
  );
};