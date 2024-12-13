export type CalendarView = "day" | "week" | "month";

export interface Post {
  id: string;
  title: string;
  content: string;
  scheduled_at: string | null;
  status: "draft" | "scheduled" | "published";
  attachments: Attachment[];
  user_id: string;
}

export interface Attachment {
  type: "image" | "document";
  url: string;
  name: string;
}