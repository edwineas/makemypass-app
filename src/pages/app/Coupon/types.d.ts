export type CouponType = {
  id: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  tickets: string[];
  active: boolean;
  created_at: string;
};

export type CreateCouponType = {
  id?: string;
  code: string;
  type: 'percentage' | 'amount';
  value: number;
  ticket_restricted: string[];
  description: string;
  is_active: boolean;
  count: number | null;
  is_private: boolean;
  conditions: {
    field: string;
    value: string;
    operator: string;
  }[];
  consumed: number;
};

export type CreateCouponTypeError = {
  code?: string[];
  type?: string[];
  value?: string[];
  tickets?: string[];
  description?: string[];
  is_active?: string[];
  count?: string[];
  is_private?: string[];
  conditions?: string[];
};

export type ActivateCouponType = {
  showModal: boolean;
  active: boolean;
  description: string;
  isCouponActive: boolean;
};
