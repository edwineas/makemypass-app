type venueVisited = {
  name: string;
  visited_at: string;
};

export type VisitedVenues = {
  status: boolean;
  venues: venueVisited[];
};

export type EmailType = {
  id: string;
  event_id: string;
  send_to: string;
  subject: string;
  type: string;
  created_at: string;
  created_by: string;
  opened_at: string;
  body?: string;
  send_from?: string;
  show_content?: boolean;
};
