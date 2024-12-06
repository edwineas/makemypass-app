interface Perk {
  id: string;
  name: string;
  count: number;
}

export interface TicketPerkType {
  ticket_id: string;
  ticket_name: string;
  perks: Perk[];
}

export interface ClaimPerkModalType {
  open: boolean;
  user_data: {
    field_key: string;
    value: string;
    title: string;
    type: string;
  }[];
}
