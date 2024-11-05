import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router';

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
  organization: OrganizationType,
  organizationState: OrganizationType,
  setIsUpdating: Dispatch<SetStateAction<boolean>>,
  navigate: NavigateFunction,
  setShowEditModal: Dispatch<SetStateAction<boolean>>,
  setTriggerFetch: Dispatch<SetStateAction<boolean>>,
) => {
  setIsUpdating(true);
  const formData = new FormData();
  const fieldsToUpdate = ['title', 'name', 'description', 'banner', 'logo'] as const;
  let hasChanges = false;
  fieldsToUpdate.forEach((field) => {
    if (organizationState[field] !== organization[field]) {
      hasChanges = true;
      formData.append(field, organizationState[field] || '');
    }
  });

  if (hasChanges)
    privateGateway
      .patch(makeMyPass.orgCRUD(organization.id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        toast.success(response.data.message.general[0] || 'Org Updated Successfully');
        setShowEditModal(false);
        setTriggerFetch((prev) => !prev);
        navigate(`/organization/${organizationState.name}`);
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Unable to process the request');
      })
      .finally(() => {
        setIsUpdating(false);
      });
  else {
    toast.error('No changes detected', {
      id: 'no-changes',
    });
    setIsUpdating(false);
  }
};

export const OrgInfoFromName = (
  orgName: string,
  setOrganization: Dispatch<SetStateAction<OrganizationType>>,
) => {
  privateGateway
    .get(makeMyPass.orgInfo(orgName))
    .then((response) => {
      console.log(response.data.response);
      setOrganization(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
