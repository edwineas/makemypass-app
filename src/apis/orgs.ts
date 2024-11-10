import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { OrganizationType } from '../pages/app/Organization/EditOrganization/types';
import type { MemberType } from '../pages/app/Organization/OrganizationGlance/types';
import { DefaultListType, hostId } from './types';

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

export const listOrgs = (
  setOrgs: Dispatch<SetStateAction<DefaultListType[]>>,
  setOrgsLoaded: Dispatch<SetStateAction<boolean>>,
) => {
  setOrgsLoaded(false);
  privateGateway
    .get(makeMyPass.listOrgs)
    .then((response) => {
      setOrgs(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    })
    .finally(() => {
      setOrgsLoaded(true);
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
    .get(makeMyPass.orgInfoPriv(orgName))
    .then((response) => {
      console.log(response.data.response);
      setOrganization(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const OrgInfoFromNamePublic = (
  orgName: string,
  setOrganization: Dispatch<SetStateAction<OrganizationType>>,
) => {
  publicGateway
    .get(makeMyPass.orgInfoPublic(orgName))
    .then((response) => {
      console.log(response.data.response);
      const org = response.data.response;

      setOrganization({
        id: org.id,
        title: org.title,
        name: org.name,
        banner: org.banner,
        logo: org.logo,
        description: org.description,
        events: org.events,
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const listOrgMembers = (
  orgId: string,
  setMembers: Dispatch<SetStateAction<MemberType[] | undefined>>,
) => {
  privateGateway
    .get(makeMyPass.orgMembersList(orgId))
    .then((response) => {
      setMembers(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const addOrgMember = (
  orgId: string,
  memberEmail: string,
  role: string,
  setTriggerFetch: Dispatch<SetStateAction<boolean>>,
) => {
  privateGateway
    .post(makeMyPass.orgMembersAdd(orgId), {
      member_email: memberEmail,
      role: role,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Member Added Successfully');
      setTriggerFetch((prev) => !prev);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const removeOrgMember = (
  orgId: string,
  memberId: string,
  setIsDeleting: Dispatch<SetStateAction<boolean>>,
  setTriggerFetch: Dispatch<SetStateAction<boolean>>,
  setSelectedMemberId: Dispatch<SetStateAction<hostId>>,
) => {
  setIsDeleting(true);
  privateGateway
    .delete(makeMyPass.orgMembersRemove(orgId), {
      data: { member_id: memberId },
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Member Removed Successfully');
      setTimeout(() => {
        setTriggerFetch((prev) => !prev);
      }, 1000);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    })
    .finally(() => {
      setIsDeleting(false);
      setSelectedMemberId({ id: '', type: null });
    });
};

export const updateOrgMember = (
  orgId: string,
  memberId: string,
  role: string,
  setTriggerFetch: Dispatch<SetStateAction<boolean>>,
) => {
  privateGateway
    .put(makeMyPass.orgMembersUpdate(orgId), {
      member_id: memberId,
      role: role,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'Member Updated Successfully');
      setTriggerFetch((prev) => !prev);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};
