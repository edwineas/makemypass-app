import { motion } from 'framer-motion';
import { IoLocationOutline } from 'react-icons/io5';

import { Event } from '../../../../apis/types';
import { getDay, getMonthAbbreviation } from '../../EventPage/constants';
import styles from './EventBox.module.css';

type Props = {
  eventData: Event;
  handleMoreClick: (eventName: string) => void;
  handleViewTicket: (eventName: string, eventRegisterId: string) => void;
};

const EventBox = ({ eventData, handleMoreClick, handleViewTicket }: Props) => {
  return (
    <>
      <motion.div
        className={styles.eventGlance}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.bannerContainer}>
          {eventData?.banner ? (
            <img src={eventData?.banner} alt='' className={styles.banner} />
          ) : (
            <svg height='250' width='100%' className={styles.banner}>
              {eventData?.title && (
                <>
                  <rect width='100%' height='100%' className={styles.banner} />
                  <text x='40%' y='50%' fill='white' className={styles.svgText}>
                    No Banner.
                  </text>
                  {/* <text x='7%' y='60%' fill='white' className={styles.svgText}>
                    Please Edit Event Details to add a banner
                  </text> */}
                </>
              )}
            </svg>
          )}
        </div>
        <div className={styles.eventDetailsContainer}>
          <div className={styles.headingTexts}>
            <p className={styles.eventTitle}>{eventData?.title}</p>
          </div>

          <div className={styles.eventDatePlace}>
            <div className={styles.eventDate}>
              {eventData?.event_start_date && (
                <>
                  <div className={styles.dateBox}>
                    <p className={styles.eventMonth}>
                      {getMonthAbbreviation(eventData?.event_start_date)}
                    </p>
                    <p className={styles.eventDateNum}>{getDay(eventData?.event_start_date)}</p>
                  </div>
                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>
                      {new Date(eventData?.event_start_date).toLocaleDateString([], {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      }) ?? ''}
                    </p>
                    <p className={styles.eventTimeText}>
                      {new Date(eventData?.event_start_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {eventData?.event_end_date && (
                        <>
                          {new Date(eventData?.event_end_date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {', '}
                          <br />
                          {new Date(eventData?.event_end_date).toLocaleDateString([], {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className={styles.eventPlace}>
              {eventData?.place && (
                <>
                  <div className={styles.locationBox}>
                    <IoLocationOutline size={25} className={styles.locationIcon} />
                  </div>

                  <div className={styles.eventDateTimeText}>
                    <p className={styles.eventDateText}>{eventData?.place}</p>
                  </div>
                </>
              )}
            </div>
            <div className={styles.buttons}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTicket(eventData.name, eventData.event_register_id as string);
                }}
                className={styles.editEventButton}
              >
                View Ticket
              </button>
              {import.meta.env.VITE_CURRENT_ENV === 'dev' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoreClick(eventData.name);
                  }}
                  className={styles.editEventButton}
                >
                  More Info
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EventBox;
