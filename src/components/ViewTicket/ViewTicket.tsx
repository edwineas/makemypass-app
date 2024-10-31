import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { TillRoles } from '../../../services/enums';
import { getEventId } from '../../apis/events';
import { viewGuestTicket } from '../../apis/guests';
import { isUserAuthorized } from '../../common/commonFunctions';
import EventHeader from '../EventHeader/EventHeader';
import Theme from '../Theme/Theme';
import styles from './ViewTicket.module.css';

const ViewTicket = () => {
  const location = useLocation();
  const [eventRegisterId, setEventRegisterId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventId, setEventId] = useState(
    JSON.parse(sessionStorage.getItem('eventData')!)?.event_id,
  );

  const [loading, setLoading] = useState(true);

  const { eventTitle, eventRegistrationId } = useParams<{
    eventTitle: string;
    eventRegistrationId: string;
  }>();

  useEffect(() => {
    if (eventTitle && !eventId)
      getEventId(eventTitle)
        .then((response) => {
          setEventId(response.id);
        })
        .catch(() => {
          toast.error('Unable to process the request');
        });

    if (eventRegistrationId) setEventRegisterId(eventRegistrationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (eventRegisterId && eventId) {
      viewGuestTicket(eventId, eventRegisterId, setImageUrl, setLoading);
    }
  }, [eventRegisterId, eventId]);

  return (
    <>
      <Theme>
        {isUserAuthorized(TillRoles.VOLUNTEER) && <EventHeader previousPageNavigate='-1' />}
        <div className={styles.ticketDisplayContainer}>
          {loading ? (
            <HashLoader color={'#46BF75'} size={50} />
          ) : imageUrl.length > 0 ? (
            <>
              <img src={imageUrl} alt='ticket' className={styles.ticketImage} />

              <button
                onClick={async () => {
                  try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();

                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute('download', 'ticket.png');

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    URL.revokeObjectURL(link.href);
                  } catch (error) {
                    toast.error('Failed to download ticket');
                  }
                }}
                className={styles.downloadTicketButton}
              >
                Download Your Ticket
              </button>
            </>
          ) : (
            <div className={styles.noTicketFound}>
              <FaExclamationTriangle size={50} color='#46BF75' />
              <p>No Ticket Found for this User</p>
            </div>
          )}
        </div>
      </Theme>
    </>
  );
};

export default ViewTicket;
