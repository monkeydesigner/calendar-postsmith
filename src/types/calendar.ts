export type CalendarView = "day" | "week" | "month";

export interface Post {
  id: string;
  title: string | null;
  content: string;
  scheduled_at: string | null;
  status: "draft" | "scheduled" | "published";
  attachments: Attachment[];
  user_id: string;
  template_id: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface Attachment {
  type: "image" | "document";
  url: string;
  name: string;
}

export type PostAction = "now" | "schedule";