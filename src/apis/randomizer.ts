import toast from 'react-hot-toast';
import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { Dispatch, SetStateAction } from 'react';
import { SpinWheelLogList, userListType } from '../pages/app/Randomizer/types';

export const getSpinWheelUserList = async (
  eventId: string,
  setUserList: Dispatch<SetStateAction<userListType[]>>,
) => {
  privateGateway
    .get(makeMyPass.spinWheelList(eventId))
    .then((response) => {
      console.log(response.data.response);
      setUserList(response.data.response.participants);
    })
    .catch(() => {
      toast.error('Failed to get perks');
    });
};

export const createSpinWheelLog = async (
  eventId: string,
  userId: string,
  setLogList: Dispatch<SetStateAction<SpinWheelLogList[]>>,
) => {
  privateGateway
    .post(makeMyPass.spinWheelLogCreate(eventId), {
      event_register_id: userId,
    })
    .then((response) => {
      toast.success('Log created successfully');
      setLogList((prev) => [...prev, response.data.response]);
    })
    .catch(() => {
      toast.error('Failed to create log');
    });
};

export const getSpinWheelLogList = async (
  eventId: string,
  setLogList: Dispatch<SetStateAction<SpinWheelLogList[]>>,
) => {
  privateGateway
    .get(makeMyPass.spinWheelLogList(eventId))
    .then((response) => {
      setLogList(response.data.response.participants);
    })
    .catch(() => {
      toast.error('Failed to get logs');
    });
};
