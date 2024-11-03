/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IoImageOutline } from 'react-icons/io5';
import ReactPlayer from 'react-player';
import { useParams, useSearchParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { getEventInfo } from '../../../apis/publicpage';
import { EventType } from '../../../apis/types';
import Theme from '../../../components/Theme/Theme';
import EventForm from './components/EventForm/EventForm';
import EventPageHeader from './components/EventPageHeader/EventPageHeader';
import SuccessModal from './components/SuccessModal/SuccessModal';
import styles from './EventPage.module.css';
import type { ClaimCodeExceedType, SuccessModalProps } from './types';

const EventPage = () => {
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const [showTicketFirst, setShowTicketFirst] = useState<boolean>(false);

  const [eventData, setEventData] = useState<EventType>();
  const [formNumber, setFormNumber] = useState<number>(eventData?.show_ticket_first ? 1 : 0);
  const [success, setSuccess] = useState<SuccessModalProps>({
    showModal: false,
    eventTitle: eventData?.title,
    eventRegisterId: '',
    loading: false,
  });

  const [claimCodeExceed, setClaimCodeExceed] = useState<ClaimCodeExceedType>({
    exceeded: false,
    message: '',
  });

  const [eventNotFound, setEventNotFound] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const claimCode = searchParams.get('claim_code');

  useEffect(() => {
    if (eventTitle)
      getEventInfo({
        eventTitle,
        setEventData,
        setEventNotFound,
        claimCode,
        setClaimCodeExceed,
        setShowTicketFirst,
        setSuccess,
        utmData: {
          source: searchParams.get('source'),
          medium: searchParams.get('medium'),
          campaign: searchParams.get('campaign'),
          term: searchParams.get('term'),
          content: searchParams.get('content'),
        },
        accessCode: searchParams.get('access_code'),
      });
  }, [eventTitle]);

  useEffect(() => {
    if (success.showModal && eventTitle)
      getEventInfo({
        eventTitle,
        setEventData,
        setEventNotFound,
        claimCode,
        setClaimCodeExceed,
        setShowTicketFirst,
        accessCode: searchParams.get('access_code'),
      });
  }, [success]);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    scrollToTop();
  }, [success]);

  useEffect(() => {
    setFormNumber(eventData?.show_ticket_first ? 1 : 0);
    console.log('eventData', eventData);
  }, [eventData]);

  const showEventHeader = () => {
    const defaultForm = eventData?.show_ticket_first ? 1 : 0;

    if (formNumber === defaultForm) return true;

    return false;
  };

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{eventData?.title}</title>
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
        <meta name='title' content={eventData?.title} />
        <meta
          name='description'
          content={
            eventData?.description
              ? eventData?.description
              : 'Do not miss out! Register now for this event to learn, network and more. Click the link below to get started.'
          }
        />

        {eventData?.script_injection &&
          eventData?.script_injection.length > 0 &&
          eventData?.script_injection.map((scriptObject) => {
            if (scriptObject.type === 'script') {
              return <script type='text/javascript'>{scriptObject.value}</script>;
            } else if (scriptObject.type === 'asyncURL') {
              return <script src={scriptObject.value} async />;
            } else if (scriptObject.type === 'url') {
              return <script src={scriptObject.value} />;
            }
          })}
      </Helmet>
      <Theme type='eventForm'>
        <SuccessModal
          success={success}
          setSuccess={setSuccess}
          hasScratchCard={eventData?.is_scratch_card}
        />

        {eventData?.err_message && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={styles.eventPageContainer}
              style={{
                margin: 'auto',
                padding: '0 1rem',
                width: 'fit-content',
              }}
            >
              <EventPageHeader eventData={eventData} />
              {eventData?.post_content &&
                (eventData.post_content.photos.length > 0 ||
                  eventData.post_content.video_link ||
                  eventData.post_content.more_photo_link) && (
                  <div className={styles.galleryContainer}>
                    <p className={styles.eventGalleryTitle}>
                      <IoImageOutline color='white' size={20} />
                      <span>Gallery</span>
                    </p>
                    <hr className={styles.line} />
                    {eventData.post_content?.video_link && (
                      <div className={styles.videoContainer}>
                        <ReactPlayer
                          url={eventData.post_content?.video_link}
                          controls
                          width={'95%'}
                        />
                      </div>
                    )}

                    <div className={styles.photolisting}>
                      {eventData.post_content?.photos.map((photo) => (
                        <div className={styles.photoContainer}>
                          <img src={photo} alt='event photo' className={styles.eventPhoto} />
                        </div>
                      ))}
                      {eventData?.post_content?.more_photo_link && (
                        <button
                          className={styles.morePhotos}
                          onClick={() => window.open(eventData.post_content?.more_photo_link)}
                        >
                          View More
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </motion.div>
            <p
              className={styles.privateEventText}
              dangerouslySetInnerHTML={{ __html: eventData.err_message }}
            ></p>
          </div>
        )}

        {eventData && !eventData?.err_message && eventData?.form?.length > 0 ? (
          <div className={styles.eventPageContainer}>
            {typeParam !== 'embed' && showEventHeader() && (
              <div className={styles.eventHeaderContainer}>
                <EventPageHeader eventData={eventData} />
              </div>
            )}
            <div className={styles.formContainer}>
              <EventForm
                formNumber={formNumber}
                setFormNumber={setFormNumber}
                eventFormData={{
                  id: eventData.id,
                  form: eventData.form,
                  tickets: eventData.tickets,
                  select_multi_ticket: eventData.select_multi_ticket ?? false,
                  is_sub_event: eventData.is_sub_event ?? false,
                  parse_audio: eventData.parse_audio ?? false,
                  coupon: eventData.coupon ?? false,
                  claim_ticket_id: eventData.claim_ticked_id,
                  is_grouped_ticket: eventData.is_grouped_ticket,
                  show_ticket_first: showTicketFirst,
                }}
                setSuccess={setSuccess}
                setEventData={setEventData}
                eventTitle={eventTitle}
                claimCode={eventData.claim_ticked_id ? claimCode : ''}
                claimCodeExceed={claimCodeExceed}
                utmData={{
                  source: searchParams.get('source'),
                  medium: searchParams.get('medium'),
                  campaign: searchParams.get('campaign'),
                  term: searchParams.get('term'),
                  content: searchParams.get('content'),
                }}
              />
            </div>
          </div>
        ) : eventNotFound ? (
          <div className={styles.eventPageContainer}>
            <p className={`${styles.privateEventText} ${styles.center}`}>
              This event does not have any registration form. Please contact the event organizer for
              more information.
            </p>
          </div>
        ) : (
          !(eventData && eventData.title) && (
            <div className={styles.center}>
              <HashLoader color='#46BF75' size={50} />
            </div>
          )
        )}
      </Theme>
    </>
  );
};

export default EventPage;
