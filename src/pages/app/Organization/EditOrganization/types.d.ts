export type OrganizationType = {
  id: string;
  title: string;
  name: string;
  banner: string | null | Blob;
  logo: string | null | Blob;
  description: string | null;
  events?: {
    Published: OrganizationEventType[];
    Completed: OrganizationEventType[];
  };
};

type OrganizationEventType = {
  id: string;
  name: string;
  title: string;
  description: string;
  logo: string | null;
  banner: string | null;
  event_start_date: string | null;
  event_end_date: string | null;
};
