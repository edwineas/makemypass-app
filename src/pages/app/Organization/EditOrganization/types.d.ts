export type OrganizationType = {
  id: string;
  title: string;
  name: string;
  banner: string | null | Blob;
  logo: string | null | Blob;
  description: string | null;
};
