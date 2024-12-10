import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { TillRoles } from '../../../services/enums';
import { getEventId } from '../../apis/events';
import { viewGuestInvoice } from '../../apis/guests';
import { isUserAuthorizedForEvent } from '../../common/commonFunctions';
import EventHeader from '../EventHeader/EventHeader';
import Theme from '../Theme/Theme';
import styles from './ViewInvoice.module.css';

const ViewInvoice = () => {
  const location = useLocation();
  const [eventRegisterId, setEventRegisterId] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState('');
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
      viewGuestInvoice(eventId, eventRegisterId, setInvoiceUrl, setLoading);
    }
  }, [eventRegisterId, eventId]);
  useEffect(() => {
    if (invoiceUrl.length > 0) {
      console.log(invoiceUrl);
    }
  }, [invoiceUrl]);

  return (
    <>
      <Theme hideLogin={true}>
        <div className={styles.viewEventHeaderContainer}>
          {isUserAuthorizedForEvent(TillRoles.VOLUNTEER) && (
            <EventHeader
              previousPageNavigate={`/${eventTitle}/guests?eventRegisterId=${eventRegisterId}`}
            />
          )}
        </div>
        <div className={styles.invoiceContainer}>
          {loading ? (
            <HashLoader color={'#46BF75'} size={50} />
          ) : invoiceUrl.length > 0 ? (
            <>
              {/* <PdfPreview fileUrl={invoiceUrl} /> */}
              <iframe src={invoiceUrl} width='100%' height='100%' className={styles.invoiceImage} />
              <div className={styles.row}>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(invoiceUrl);
                      const blob = await response.blob();

                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.setAttribute('download', 'invoice.pdf');

                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      URL.revokeObjectURL(link.href);
                    } catch (error) {
                      toast.error('Failed to download invoice');
                    }
                  }}
                  className={styles.downloadInvoiceButton}
                >
                  Download Your Invoice
                </button>
              </div>
            </>
          ) : (
            <div className={styles.noInvoiceFound}>
              <FaExclamationTriangle size={50} color='#46BF75' />
              <p>No Invoice Found for this User</p>
            </div>
          )}
        </div>
      </Theme>
    </>
  );
};

export default ViewInvoice;
