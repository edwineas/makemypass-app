import { Dispatch } from 'react';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { EmailType } from '../pages/app/Guests/components/ViewGuest/types';
import { PaginationDataType } from '../pages/app/Guests/types';

export const getEventMailLog = async (
  eventId: string,
  setAllMailLog: Dispatch<React.SetStateAction<EmailType[]>>,
  setIsLoading: Dispatch<React.SetStateAction<boolean>>,
  paginationData: PaginationDataType,
  setPaginationData: Dispatch<React.SetStateAction<PaginationDataType>>,
) => {
  setIsLoading(true);
  privateGateway
    .get(makeMyPass.mailLog(eventId), {
      params: {
        per_page: paginationData.per_page,
        page: paginationData.page,
      },
    })
    .then((response) => {
      setAllMailLog(response.data.response.data);
      setPaginationData(response.data.response.pagination);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

export const getEventIndividualMailLog = async (
  eventId: string,
  selectedMail: {
    id: string;
    body: string;
  },
  setSelectedMailLog: Dispatch<React.SetStateAction<{ id: string; body: string }>>,
) => {
  privateGateway.get(makeMyPass.individualMailLog(eventId, selectedMail.id)).then((response) => {
    setSelectedMailLog({
      id: selectedMail.id,
      body: response.data.response.body,
    });
  });
};
