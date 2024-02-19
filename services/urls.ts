const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const buildVerseURL = buildURL('/buildverse');
const makeMyPassURL = buildURL('/makemypass');

export const buildVerse = {
  login: buildVerseURL('/login/'),
  getAccessToken: buildVerseURL('/get-access-token/'),
  generateOTP: buildVerseURL('/generate-otp/'),
  preRegister: buildVerseURL('/pre-register/'),
  register: buildVerseURL('/register/'),
};

export const makeMyPass = {
  onboardUser: makeMyPassURL('/onboard-user/'),
  listEvents: makeMyPassURL('/list-events/'),
  listHosts: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/list-hosts/`),
  getEventId: (eventName: string) => makeMyPassURL(`/get-event-id/${eventName}/`),
  checkInUser: (ticketCode: string, eventId: string) =>
    makeMyPassURL(`/checkin/${eventId}/register/${ticketCode}/`),
  getEventData: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/info`),
  resentTicket: makeMyPassURL('/manage-event/resent-ticket/'),
  checkInCount: (eventId: string) => makeMyPassURL(`/checkin/${eventId}/checkin-count/`),
  editSubmission: (eventId: string, submissionId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/edit-submission/${submissionId}`),

  listSpinWheelItems: (eventId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/list-spin-wheel-items/`),
  spin: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-event/${eventId}/spin/${ticketCode}`),
  listUserGift: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-event/${eventId}/list-user-gift/${ticketCode}`),
  claimGift: (eventId: string, ticketCode: string, date: string) =>
    makeMyPassURL(`/manage-event/${eventId}/claim-gift/${ticketCode}/${date}`),
  downloadTicket: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/manage-event/${eventId}/download-ticket/${ticketCode}`),

  addHost: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/add-host/`),
  updateHostRole: (eventId: string) => makeMyPassURL(`/manage-event/${eventId}/update-host-role/`),
  removeHost: (eventId: string, hostId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/remove-host/${hostId}`),
  hostWithUs: makeMyPassURL(`/host-with-us/`),

  userInfo: (eventId: string, ticketCode: string) =>
    makeMyPassURL(`/checkin/${eventId}/user-info/${ticketCode}`),

  getTicketInfo: (eventId: string) => makeMyPassURL(`/rsvp/get-tickets-info/${eventId}/`),
  getFormFields: (evenid: string) => makeMyPassURL(`/rsvp/get-form-fields/${evenid}/`),
  submitForm: (eventId: string) => makeMyPassURL(`/rsvp/submit/${eventId}/`),

  createPayment: (ticketId: string) => makeMyPassURL(`/rsvp/create-order/${ticketId}/`),
  validateCoupon: (eventId: string) => makeMyPassURL(`/rsvp/apply-coupon-code/${eventId}/`),

  registerUpdateView: (eventId: string) => makeMyPassURL(`/register-update-view/${eventId}/`),
  validateRsvp: (ticketId: string) => makeMyPassURL(`/rsvp/validate-rsvp/${ticketId}/`),
  getEventDatas: (eventId: string) => makeMyPassURL(`/event/${eventId}/info/`),

  sentInvite: (eventId: string, ticketId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/sent-invite/${ticketId}`),

  shortListUser: (eventId: string, userId: string) =>
    makeMyPassURL(`/manage-event/${eventId}/short-list-user/${userId}`),
};

export const makeMyPassSocket = {
  recentRegistrations: (eventId: string) => `manage-event/${eventId}/recent-registrations/`,

  analytics: (eventId: string) => `manage-event/${eventId}/analytics/`,
  registerCounts: (eventId: string) => `manage-event/${eventId}/register-count/`,
  checkInCounts: (eventId: string) => `checkin/${eventId}/count/`,

  listGuests: (eventId: string) => `manage-event/${eventId}/list-guests/`,
  listCheckinGuests: (eventId: string) => `checkin/${eventId}/list-guests/`,

  checkInAnalytics: (eventId: string) => `checkin/${eventId}/checkin-analytics/`,
};
