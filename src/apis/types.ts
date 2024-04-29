import { ReactNode } from 'react';

export type Event = {
  id: string;
  title: string;
  members: number;
  logo: string | null;
  date: string;
  day: string;
  name: string;
  start_day: string;
  start_date: string;
};

export type hostList = {
  id: string;
  name: string;
  email: string;
  is_private: boolean;
  role: string;
};

export type User = {
  name: string;
  email: string;
  phone: string;
  district: string;
  organization: string;
  category: string;
};

export type FormDataType = {
  [key: string]: string | string[];
};

export type ErrorMessages = {
  [key: string]: string[];
};

export type EventHosts = {
  profile_pic: string;
  id: string;
  name: string;
};

interface LocationType {
  lat: number;
  lng: number;
}

interface HostType {
  id: string;
  name: string;
  profile_pic: string;
}

export type FormFieldType = {
  id: string;
  type: string;
  title: string;
  unique: boolean;
  required: boolean;
  field_key: string;
  description?: string;
  options?: string[];
  integration?: {
    url: string;
    method: string;
  };
  property?: {
    file_size: number;
    extension_types: string[];
    max_no_of_files: number;
  };
  condition?: {
    field: string;
    value: string;
    operator: string;
  }[];
};

export interface TicketType {
  [x: string]: any;
  description: ReactNode;
  id: string;
  price: number;
  perks: any; // You can define a proper type for perks if needed
  slots_left: number | null;
  default_selected: boolean;
  platform_fee: number;
  platform_fee_from_user: boolean;
  currency: string;
}

interface CouponType {
  status: string;
  description: string;
  value?: string;
  error?: string;
}

export interface EventType {
  err_message: ReactNode;
  id: string;
  name: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  reg_start_date: string;
  reg_end_date: string;
  event_start_date: string;
  event_end_date: string;
  start_time: string;
  end_time: string;
  logo: string;
  banner: string;
  location: LocationType;
  place: string;
  hosts: HostType[];
  form: FormFieldType[];
  tickets: {
    [key: string]: TicketType;
  };
  shortlist: boolean;
  coupon: CouponType;
  parse_audio?: boolean;
  select_multi_ticket?: boolean;
  capacity?: number;
  is_private: boolean;
  is_online: boolean;
  approval_required: boolean;
  status: string;
}

export type EventDetails = {
  id: string;
  banner: string;
  name: string;
  title: string;
  description: string | null;
  date: string;
  logo: string;
  time: string;
  hosts: EventHosts[];
  location: {
    lat: number;
    lng: number;
  };
  registered_members_count: number;
  is_private: boolean;
  shortlist: boolean;
  place: string;
  start_time: string;
  start_date: string;
  end_date: string;
  end_time: string;
};

export type FileType = {
  file_id: string;
  status: string;
  success_count: number;
  failure_count: number;
  total_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};
