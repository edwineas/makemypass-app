import { Roles } from '../../../../services/enums';

export type NewEventStateType = {
  eventName: string;
  orgId: string;
  error: string[];
  showLimitationMessage: boolean;
};

export type OrgListType = {
  id: string;
  name: string;
  role: Roles;
};
