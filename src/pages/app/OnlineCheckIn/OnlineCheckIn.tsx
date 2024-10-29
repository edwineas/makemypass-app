import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BeatLoader } from 'react-spinners';

import {
  getScanGuestOnlineCheckinInfo,
  scanGuestOnlineCheckin,
} from '../../../apis/online-checkin';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField';
import { getDay, getMonthAbbreviation } from '../EventPage/constants';
import styles from './OnlineCheckIn.module.css';
import type { UserCheckInEventType } from './types';

const OnlineCheckIn = () => {
  const [eventData, setEventData] = useState<UserCheckInEventType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInPassword, setCheckInPassword] = useState<string>('');
  const [error, setError] = useState<string[]>([]);

  const { eventTitle, eventRegisterId } = useParams<{
    eventTitle: string;
    eventRegisterId: string;
  }>();

  useEffect(() => {
    if (eventTitle && eventRegisterId)
      getScanGuestOnlineCheckinInfo(eventTitle, eventRegisterId, setEventData);
  }, [eventTitle, eventRegisterId]);

  const handleSubmit = () => {
    if (!checkInPassword) {
      setError(['Please enter the key']);
      return;
    }
    if (eventTitle && eventRegisterId) {
      scanGuestOnlineCheckin(eventTitle, eventRegisterId, checkInPassword, setError, setLoading);
    }
  };

  return (
    <Theme>
      <div className={styles.onlineCheckInContainer}>
        <div className={styles.eventTopHeader}>
          {eventData?.banner && typeof eventData.banner === 'string' && (
            <img
              className={styles.bannerImg}
              src={eventData?.banner}
              alt='banner image depecting event information'
            />
          )}
          <div
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            <p className={styles.eventTitle}>{eventData?.title}</p>

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
                    </div>
                  </>
                )}
              </div>
            </div>
            <br />
            {eventData?.online_event_link && (
              <a href={eventData?.online_event_link}>
                <button className={styles.otpSubmitButton}>Join Event</button>
              </a>
            )}
          </div>
        </div>
        {!eventData?.already_checkedin && (
          <div className={styles.otpContainer}>
            <p className={styles.checkInHeader}>Check-In to the Event</p>
            <InputField
              title='Enter the Unique Key'
              type='text'
              placeholder='Key will be provided ones you have joined the event'
              id='checkin_password'
              name='checkin_password'
              required
              icon={<></>}
              onChange={(e) => {
                setCheckInPassword(e.target.value);
              }}
              error={Array.from(error)}
            />
            <button className={styles.otpSubmitButton} onClick={handleSubmit}>
              {loading ? <BeatLoader color='#272727' loading={loading} size={10} /> : 'Check-In'}
            </button>
          </div>
        )}
      </div>
    </Theme>
  );
};

export default OnlineCheckIn;
