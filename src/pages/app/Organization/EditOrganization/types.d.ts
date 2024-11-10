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
  socials: {
    email: string;
    phone: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    whatsapp: string;
    instagram: string;
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
