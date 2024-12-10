import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getEventId } from '../../../apis/events';
import EventHeader from '../../../components/EventHeader/EventHeader';
import Theme from '../../../components/Theme/Theme';
import styles from './UserEventInfo.module.css';

const UserEventInfo = () => {
  const { eventTitle: eventName } = useParams<{ eventTitle: string }>();
  const [eventId, setEventId] = useState(JSON.parse(sessionStorage.getItem('eventData')!)?.id);
  const [eventTitle, setEventTitle] = useState(
    JSON.parse(sessionStorage.getItem('eventData')!)?.title,
  );

  useEffect(() => {
    if (eventName && (!eventId || !eventTitle)) {
      getEventId(eventName).then((response) => {
        setEventId(response.id);
        setEventTitle(response.title);
      });
    }
  }, [eventId, eventName, eventTitle]);

  return (
    <Theme>
      <div className={styles.userEventInfoContainer}>
        <EventHeader custom={true} customName={eventTitle} previousPageNavigate='-1' />
        <div className={styles.userEventInfo}></div>
      </div>
    </Theme>
  );
};

export default UserEventInfo;
