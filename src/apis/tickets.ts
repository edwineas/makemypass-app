import toast from 'react-hot-toast';

import { privateGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import { TicketType } from './types';

export const getTicketsList = async (
  eventId: string,
  setTicketInfo: React.Dispatch<React.SetStateAction<TicketType[]>>,
) => {
  privateGateway
    .get(makeMyPass.ticketList(eventId))
    .then((response) => {
      setTicketInfo(response.data.response.tickets);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Error in Fetching Tickets');
    });
};

export const createTicket = async (eventId: string, ticket: TicketType) => {
  delete ticket['new'];
  try {
    const response = await privateGateway.post(makeMyPass.ticketCreate(eventId), ticket, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success(response.data.message.general[0] || 'Ticket Created Successfully');
    return response.data.response.ticket_id as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error.response.data.message.general[0] || 'Unable to process the request');
  }
};

export const updateTicketData = async (
  eventId: string,
  selectedTicket: TicketType,
  //Fix this any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changedData: Record<string, any>,
  setTickets: React.Dispatch<React.SetStateAction<TicketType[]>>,
) => {
  try {
    const response = await privateGateway.put(
      makeMyPass.ticketInformation(eventId, selectedTicket?.id),
      changedData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (changedData.default_selected === true) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? changedData.default_selected === true
              ? { ...selectedTicket, default_selected: true }
              : selectedTicket
            : { ...t, default_selected: false },
        ),
      );
    } else {
      setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? selectedTicket : t)));
    }
    changedData.default_selected === true
      ? toast.success(response?.data?.message?.general[0] || 'Default Ticket Changed')
      : toast.success(response?.data?.message?.general[0] || 'Ticket Updated Successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.response?.data?.message?.general[0] || 'Unable to process the request');
  }
};

export const deleteTicket = async (
  eventId: string,
  ticketId: string,
  setTickets: React.Dispatch<React.SetStateAction<TicketType[]>>,
) => {
  const toastId = toast.loading('Deleting Ticket...');
  privateGateway
    .delete(makeMyPass.ticketInformation(eventId, ticketId))
    .then((response) => {
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      toast.success(response?.data?.message?.general[0] || 'Ticket Deleted Successfully', {
        id: toastId,
      });
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message?.general[0] || 'Unable to process the request', {
        id: toastId,
      });
    });
};
