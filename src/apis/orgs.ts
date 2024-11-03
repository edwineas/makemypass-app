import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { OrganizationType } from '../pages/app/Organization/EditOrganization/types';
import { DefaultListType } from './types';

export const createOrg = (eventTitle: string) => {
  const userEmail = localStorage.getItem('userEmail');
  privateGateway
    .post(makeMyPass.orgCreate, {
      title: eventTitle,
      email: userEmail,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Org Created Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const listOrgs = (setOrgs: Dispatch<SetStateAction<DefaultListType[]>>) => {
  privateGateway
    .get(makeMyPass.listOrgs)
    .then((response) => {
      setOrgs(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const getOrgData = (
  orgId: string,
  setOrganization: Dispatch<SetStateAction<OrganizationType>>,
) => {
  privateGateway
    .get(makeMyPass.orgCRUD(orgId))
    .then((response) => {
      setOrganization(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const updateOrg = (
  orgId: string,
  organizationState: OrganizationType,
  setIsUpdating: Dispatch<SetStateAction<boolean>>,
) => {
  setIsUpdating(true);
  const formData = new FormData();
  formData.append('title', organizationState.title);
  formData.append('name', organizationState.name);
  formData.append('description', organizationState.description || '');
  formData.append('banner', organizationState.banner || '');
  formData.append('logo', organizationState.logo || '');

  privateGateway
    .patch(makeMyPass.orgCRUD(orgId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Org Updated Successfully');
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    })
    .finally(() => {
      setIsUpdating(false);
    });
};
