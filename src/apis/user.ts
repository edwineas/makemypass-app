import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { buildVerse } from '../../services/urls';
import type { userData } from '../pages/app/ProfilePage/types';

export const updateUserProfile = async (
  userData: userData | undefined,
  originalData: userData | undefined,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setLoading && setLoading(true);
  const toastId = toast.loading('Updating Profile...');

  const data = new FormData();

  if (userData?.name !== originalData?.name) {
    data.append('name', userData?.name || '');
  }
  if (userData?.email !== originalData?.email) {
    data.append('email', userData?.email || '');
  }
  if (userData?.profile_pic !== originalData?.profile_pic) {
    if (userData?.profile_pic) {
      data.append('profile_pic', userData.profile_pic);
    }
  }

  return privateGateway
    .put(buildVerse.updateProfile, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success('Profile Updated Successfully', {
        id: toastId,
      });
    })
    .catch((error) => {
      toast.error(error.response?.data?.message?.general[0] || 'Error in Updating Profile', {
        id: toastId,
      });
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const setUserData = async ({
  formData,
  token,
  setLoading,
}: {
  formData: FormData;
  token: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setLoading && setLoading(true);
  return privateGateway
    .post(buildVerse.setUserData(token), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      toast.success('Profile Updated Successfully');
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message.general[0] || 'Error in Updating Profile');
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};

export const getProfileInfo = async ({
  setUserData,
  setOriginalUserData,
}: {
  setUserData: React.Dispatch<React.SetStateAction<userData | undefined>>;
  setOriginalUserData: React.Dispatch<React.SetStateAction<userData | undefined>>;
}) => {
  return privateGateway
    .get(buildVerse.profileInfo)
    .then((response) => {
      setUserData(response.data.response);
      setOriginalUserData(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Profile Info');
    });
};
