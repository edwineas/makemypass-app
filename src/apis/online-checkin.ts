import toast from 'react-hot-toast';

import { publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { UserCheckInEventType } from '../pages/app/OnlineCheckIn/types';

export const getScanGuestOnlineCheckinInfo = async (
  eventName: string,
  eventRegisterId: string,
  setGuestInfo: React.Dispatch<React.SetStateAction<UserCheckInEventType | undefined>>,
) => {
  publicGateway
    .get(makeMyPass.scanGuestOnlineCheckinInfo(eventName, eventRegisterId))
    .then((response) => {
      setGuestInfo(response.data.response);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
    });
};

export const scanGuestOnlineCheckin = async (
  eventName: string,
  eventRegisterId: string,
  checkInPassword: string,
  setError: React.Dispatch<React.SetStateAction<string[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setLoading(true);
  publicGateway
    .post(makeMyPass.scanGuestOnlineCheckin(eventName, eventRegisterId), {
      check_in_password: checkInPassword,
      event_register_id: eventRegisterId,
      even_name: eventName,
    })
    .then((response) => {
      if (response.data.response) {
        setError([]);
        toast.success('Guest checked in successfully');
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Unable to process the request');
      setError(error.response.data.message.general);
    })
    .finally(() => {
      setLoading(false);
    });
};
