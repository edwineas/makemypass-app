import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoLocationOutline } from 'react-icons/io5';
import { useParams } from 'react-router';

import { getEventId } from '../../../../apis/events';
import {
  getSubEventForm,
  getSubEvents,
  removeSubEvent,
  subEventRegister,
} from '../../../../apis/subevents';
import { FormFieldType, SubEventType } from '../../../../apis/types';
import { formatDate, formatTime } from '../../../../common/commonFunctions';
import DynamicForm from '../../../../components/DynamicForm/DynamicForm';
import Modal from '../../../../components/Modal/Modal';
import Theme from '../../../../components/Theme/Theme';
import { getDay, getMonthAbbreviation } from '../../EventPage/constants';
import styles from './ListSubEvents.module.css';
import type { SelectedSubEventsType } from './types';

const groupEventsByDateAndTime = (events: SubEventType[]) => {
  return events.reduce((acc: Record<string, Record<string, SubEventType[]>>, event) => {
    const eventDate = formatDate(event.start_time);
    const eventTime = formatTime(event.start_time);
    if (!acc[eventDate]) {
      acc[eventDate] = {};
    }
    if (!acc[eventDate][eventTime]) {
      acc[eventDate][eventTime] = [];
    }
    acc[eventDate][eventTime].push(event);
    return acc;
  }, {});
};

const ListSubEvents = () => {
  const [subEvents, setSubEvents] = useState<SubEventType[]>([]);
  const [eventId, setEventId] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<SelectedSubEventsType[]>([]);
  const [showDetailedView, setShowDetailedView] = useState<SubEventType | null>(null);
  const [subEventForm, setSubEventForm] = useState<FormFieldType[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [subEventToRemove, setSubEventToRemove] = useState<string | null>(null);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const { eventTitle, eventRegisterId } = useParams<{
    eventTitle: string;
    eventRegisterId: string;
  }>();

  useEffect(() => {
    if (eventTitle && !eventId) {
      getEventId(eventTitle)
        .then((response) => {
          setEventId(response.id);
        })
        .catch(() => {
          toast.error('Unable to process the request');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (eventId && eventRegisterId) {
      getSubEvents(eventId, eventRegisterId, setSubEvents);
    }
  }, [eventId, eventRegisterId, triggerFetch]);

  useEffect(() => {
    const preSelectedEvents = subEvents
      .filter((event) => event.already_booked)
      .map((event) => ({ id: event.id, alreadyRegistered: true }));
    setSelectedEvents(preSelectedEvents);
  }, [subEvents]);

  useEffect(() => {
    if (subEventForm.length === 0 && eventRegisterId && eventId) {
      subEventRegister(
        eventId,
        eventRegisterId,
        formData,
        selectedEvents,
        setFormErrors,
        setTriggerFetch,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subEventForm]);

  const handleSelectEvent = (event: SubEventType) => {
    if (selectedEvents.find((e) => e.id === event.id)) {
      setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id));
    } else {
      setSelectedEvents([...selectedEvents, { id: event.id, alreadyRegistered: false }]);
    }
  };

  const groupedEvents = groupEventsByDateAndTime(subEvents);

  const handleSubmit = () => {
    if (eventId && eventRegisterId)
      getSubEventForm(eventId, eventRegisterId, selectedEvents, setSubEventForm, setShowFormModal);
  };

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const isEventDisabled = (event: SubEventType) => {
    if (event.already_booked) return false;

    return selectedEvents.some((e) => {
      const selectedEvent = subEvents.find((se) => se.id === e.id && event.id !== e.id);
      if (!selectedEvent) return false;

      const eventDate = formatDate(event.start_time);
      const selectedEventDate = formatDate(selectedEvent.start_time);

      if (eventDate === selectedEventDate) console.log(event.title, selectedEvent.title);

      return (
        eventDate === selectedEventDate &&
        new Date(event.start_time) >= new Date(selectedEvent.start_time) &&
        new Date(event.end_time) <= new Date(selectedEvent.end_time)
      );
    });
  };

  const showErrorMessage = (event: SubEventType) => {
    const collidingEvents = selectedEvents
      .map((e) => subEvents.find((se) => se.id === e.id))
      .filter((selectedEvent) => {
        if (!selectedEvent) return false;

        const eventDate = formatDate(event.start_time);
        const selectedEventDate = formatDate(selectedEvent.start_time);

        return (
          eventDate === selectedEventDate &&
          new Date(event.start_time) >= new Date(selectedEvent.start_time) &&
          new Date(event.end_time) <= new Date(selectedEvent.end_time)
        );
      })
      .map((e) => e?.title)
      .filter(Boolean);

    if (collidingEvents.length > 0) {
      toast.error(`This event timings clashes with: ${collidingEvents.join(', ')}`);
    }
  };

  return (
    <Theme>
      {subEventToRemove && (
        <Modal title='Cancel Sub Event' onClose={() => setSubEventToRemove(null)}>
          <p className={styles.modalDescription}>Are you sure you want to cancel this sub event?</p>
          <div className='row'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={styles.submitButton}
              onClick={() => {
                if (eventId && eventRegisterId)
                  removeSubEvent(
                    eventId,
                    eventRegisterId,
                    subEventToRemove,
                    setSelectedEvents,
                    setSubEventToRemove,
                    setTriggerFetch,
                  );
              }}
            >
              Yes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={styles.cancelButton}
              onClick={() => setSubEventToRemove(null)}
            >
              No
            </motion.button>
          </div>
        </Modal>
      )}
      {showDetailedView && (
        <Modal title={showDetailedView.title} onClose={() => setShowDetailedView(null)} type='side'>
          <div className={styles.detailedView}>
            <div className={styles.eventDetails}>
              <div className={styles.headingTexts}>
                <p className={styles.eventTitle}>{showDetailedView?.title}</p>
                <div className={styles.eventDatePlace}>
                  <div className={styles.eventDate}>
                    {showDetailedView?.start_time && (
                      <>
                        <div className={styles.dateBox}>
                          <p className={styles.eventMonth}>
                            {getMonthAbbreviation(showDetailedView?.start_time)}
                          </p>
                          <p className={styles.eventDateNum}>
                            {getDay(showDetailedView?.start_time)}
                          </p>
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>
                            {new Date(showDetailedView?.start_time).toLocaleDateString([], {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }) ?? ''}
                          </p>
                          <p className={styles.eventTimeText}>
                            {new Date(showDetailedView?.start_time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {showDetailedView?.end_time && (
                              <>
                                {new Date(showDetailedView?.end_time).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {', '}
                                {new Date(showDetailedView?.end_time).toLocaleDateString([], {
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
                    {showDetailedView?.place && (
                      <>
                        <div className={styles.locationBox}>
                          <IoLocationOutline size={25} className={styles.locationIcon} />
                        </div>
                        <div className={styles.eventDateTimeText}>
                          <p className={styles.eventDateText}>{showDetailedView?.place}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.eventDescription}>
                  <p
                    dangerouslySetInnerHTML={
                      showDetailedView.description
                        ? { __html: showDetailedView.description }
                        : { __html: '' }
                    }
                    style={{
                      transition: 'max-height 0.3s ease',
                    }}
                  ></p>
                </div>
              </div>

              <div className='row'>
                <motion.button
                  onClick={() => handleSelectEvent(showDetailedView)}
                  className={styles.manage}
                >
                  {selectedEvents.find((e) => e.id === showDetailedView.id) ? 'Deselect' : 'Select'}
                </motion.button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {showFormModal && subEventForm && subEventForm.length > 0 && (
        <Modal title='Enter Additional Information' onClose={() => setSubEventForm([])} type='side'>
          <p className={styles.modalDescription}>
            Required below are the fields which are newly required for the selected events.
          </p>
          <div className={styles.formContainer}>
            <DynamicForm
              formFields={subEventForm}
              formErrors={formErrors}
              formData={formData}
              onFieldChange={onFieldChange}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={styles.submitButton}
            onClick={() => {
              if (eventId && eventRegisterId)
                subEventRegister(
                  eventId,
                  eventRegisterId,
                  formData,
                  selectedEvents,
                  setFormErrors,
                  setTriggerFetch,
                  setShowFormModal,
                );
            }}
          >
            Submit
          </motion.button>
        </Modal>
      )}
      <div className={styles.subEventsListingContainer}>
        {subEvents &&
          Object.keys(groupedEvents).map((date) => (
            <div key={date}>
              <p className={styles.dateHeader}>{date}</p> {/* Display date header */}
              <div className={styles.timeContaianer}>
                {Object.keys(groupedEvents[date]).map((time) => (
                  <div key={time}>
                    <p className={styles.timeHeader}>{time}</p> {/* Display time header */}
                    <div className={styles.eventsContainer}>
                      {groupedEvents[date][time].map((event) => (
                        <div key={event.id} className={styles.event}>
                          {event.already_booked && <p className={styles.registedTag}>Registered</p>}
                          <div>
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className={`${styles.eventCard} ${
                                selectedEvents.find((e) => e.id === event.id)
                                  ? styles.selectedCard
                                  : ''
                              }`} // Add a selected class if event is selected
                              onClick={() =>
                                isEventDisabled(event)
                                  ? showErrorMessage(event)
                                  : handleSelectEvent(event)
                              }
                              style={{
                                zIndex: 0,
                                opacity: isEventDisabled(event) ? 0.3 : 1,
                              }}
                            >
                              <div className={styles.innerCard}>
                                <div className={styles.eventDetails}>
                                  <div className={styles.headingTexts}>
                                    <p className={styles.eventTitle}>{event?.title}</p>
                                  </div>

                                  <div className={styles.eventDatePlace}>
                                    <div className={styles.eventDate}>
                                      {event?.start_time && (
                                        <>
                                          <div className={styles.dateBox}>
                                            <p className={styles.eventMonth}>
                                              {getMonthAbbreviation(event?.start_time)}
                                            </p>
                                            <p className={styles.eventDateNum}>
                                              {getDay(event?.start_time)}
                                            </p>
                                          </div>
                                          <div className={styles.eventDateTimeText}>
                                            <p className={styles.eventDateText}>
                                              {new Date(event?.start_time).toLocaleDateString([], {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                              }) ?? ''}
                                            </p>
                                            <p className={styles.eventTimeText}>
                                              {new Date(event?.start_time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                              })}{' '}
                                              -{' '}
                                              {event?.end_time && (
                                                <>
                                                  {new Date(event?.end_time).toLocaleTimeString(
                                                    [],
                                                    {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                    },
                                                  )}
                                                  {', '}
                                                  {new Date(event?.end_time).toLocaleDateString(
                                                    [],
                                                    {
                                                      month: 'long',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                    },
                                                  )}
                                                </>
                                              )}
                                            </p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div className={styles.eventPlace}>
                                      {event?.place && (
                                        <>
                                          <div className={styles.locationBox}>
                                            <IoLocationOutline
                                              size={25}
                                              className={styles.locationIcon}
                                            />
                                          </div>
                                          <div className={styles.eventDateTimeText}>
                                            <p className={styles.eventDateText}>{event?.place}</p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className='row'>
                                    {
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className={styles.manage}
                                        disabled={isEventDisabled(event)}
                                        onClick={() => {
                                          if (event.already_booked) setSubEventToRemove(event.id);
                                          else handleSelectEvent(event);
                                        }}
                                      >
                                        {event.already_booked
                                          ? 'Cancel'
                                          : selectedEvents.find((e) => e.id === event.id)
                                            ? 'Deselect'
                                            : 'Select'}
                                      </motion.button>
                                    }
                                    <motion.button
                                      onClick={() => setShowDetailedView(event)}
                                      className={styles.manage}
                                    >
                                      View More
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className={styles.submitButton}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </motion.button>
    </Theme>
  );
};

export default ListSubEvents;
