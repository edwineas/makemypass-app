import { Dispatch } from 'react';
import toast from 'react-hot-toast';

import { privateGateway, publicGateway } from '../../services/apiGateway';
import { makeMyPass } from '../../services/urls';
import type { Tickets } from '../pages/app/EventPage/types';
import { GuestsType, PaginationDataType, SelectedGuest } from '../pages/app/Guests/types';
import { ErrorMessages, FormDataType, PaymentDetails } from './types';

export const setGuestShortlistStatus = (
  eventId: string,
  userId: string,
  isShortListed: boolean,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
) => {
  privateGateway
    .post(makeMyPass.guestShortList(eventId, userId), {
      is_approved: isShortListed,
    })
    .then((response) => {
      toast.success(response.data.message.general[0] || 'User shortlisted successfully');
      setSelectedGuestId(null);
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'User shortlisting failed');
    });
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export const addGuest = (
  eventId: string,
  tickets: Tickets[],
  formData: FormDataType,
  setFormErrors: Dispatch<React.SetStateAction<ErrorMessages>>,
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>,
  selectedDate?: string | null | undefined,
  ticketCode?: string | null,
  isCashInHand?: boolean,
  setLoading?: Dispatch<React.SetStateAction<boolean>>,
) => {
  if (setLoading) setLoading(true);
  if (selectedDate) {
    formData['ticket_date'] = selectedDate;
  }

  if (isCashInHand) {
    formData['is_cash_in_hand'] = isCashInHand.toString();
  }

  const backendFormData = new FormData();

  //Trim the formData to remove spaces
  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === 'string') {
      formData[key] = formData[key].toString().trim();
    }
  });

  Object.keys(formData).forEach((key) => {
    let value = formData[key];

    if (!(value instanceof FileList)) {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((value) => backendFormData.append(key + '[]', value));
      } else {
        value = formData[key].toString();
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      backendFormData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((value) => backendFormData.append(key + '[]', value));
    }
  });

  tickets.forEach((ticket) => {
    backendFormData.append('tickets[]', JSON.stringify(ticket));
  });

  if (ticketCode) {
    backendFormData.append('ticket_code', ticketCode);
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  privateGateway
    .post(makeMyPass.guestSendInvite(eventId), backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.data.response.gateway_type) {
        toast.success('Complete Payment to Invite Guest');
        const paymentId: string = response.data.response.id;
        const paymentAmount: string = response.data.response.amount;
        type RazorpayPaymentDetails = PaymentDetails<'razorpay'>;
        const options = {
          key_id: response.data.response.gateway_key,
          amount: paymentAmount,
          currency: response.data.response.currency,
          name: 'MakeMyPass',
          description: 'Event Registration',
          image: '/pwa/maskable.webp',
          order_id: paymentId,
          handler: function (response: RazorpayPaymentDetails) {
            const audio = new Audio('/sounds/gpay.mp3');
            audio.play();

            publicGateway
              .post(makeMyPass.formValidatePayment, {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                payment_signature: response.razorpay_signature,
              })
              .then(() => {
                setTimeout(() => {
                  setSelectedGuestId(null);
                  toast.success('Guest added successfully');
                }, 2000);
              })
              .catch((error) => {
                toast.error(
                  error.response.data.message.general[0] || 'Error in Validating Payment',
                );
              });
          },
          theme: {
            color: '#00FF82',
          },
        };

        const rzp1 = new window.Razorpay(options);

        rzp1.open();
      } else {
        toast.success(response.data.message.general[0] || 'Guest added successfully');
        setSelectedGuestId(null);
      }
    })
    .catch((error) => {
      toast.error(error.response.data.message.general[0] || 'Guest adding failed');
      setFormErrors(error.response.data.message);
    })
    .finally(() => {
      if (setLoading) {
        setLoading(false);
      }
    });
};

export const listGuestsPagination = (
  eventId: string,
  setGuests: Dispatch<React.SetStateAction<GuestsType[]>>,
  paginationData: PaginationDataType | undefined,
  setPaginationData: Dispatch<React.SetStateAction<PaginationDataType>>,
  showCheckedInOnly: boolean,
  searchKeyword: string,
  showApprovedOnly: boolean,
) => {
  if (paginationData && paginationData.page && paginationData.page) {
    const previouslyHadSearchKeyword = paginationData.searchKeyword !== searchKeyword;
    setPaginationData((prev) => ({ ...prev, fetchingData: true }));
    privateGateway
      .get(makeMyPass.guestList(eventId), {
        params: {
          per_page: paginationData.per_page,
          page: previouslyHadSearchKeyword ? 1 : paginationData.page,
          checkin_only: showCheckedInOnly,
          search: searchKeyword,
          approved_only: showApprovedOnly,
        },
      })
      .then((response) => {
        setGuests(response.data.response.data);
        setPaginationData((prev) => ({
          ...prev,
          total_pages: response.data.response.pagination.total_pages,
          total_items: response.data.response.pagination.total_items,
          per_page: response.data.response.pagination.per_page,
          page: previouslyHadSearchKeyword ? 1 : response.data.response.pagination.page,
          fetchingData: false,
          next: response.data.response.pagination.next,
          previous: response.data.response.pagination.previous,
          searchKeyword: searchKeyword,
        }));
      })
      .catch((error) => {
        toast.error(error.response.data.message.general[0] || 'Error in fetching guests');
      })
      .finally(() => {
        setPaginationData((prev) => ({ ...prev, fetchingData: false }));
      });
  }
};
