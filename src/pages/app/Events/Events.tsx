import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BsArrowRight, BsThreeDots } from 'react-icons/bs';
import { FaSearch, FaTags } from 'react-icons/fa';
import { GoPeople } from 'react-icons/go';
import { IoIosCreate, IoMdSettings } from 'react-icons/io';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { BeatLoader } from 'react-spinners';

import { TillRoles } from '../../../../services/enums';
import {
  createDuplicateEvent,
  createEvent,
  getCommonTags,
  getEventsList,
  setEventInfoLocal,
} from '../../../apis/events';
import { listOrgs } from '../../../apis/orgs';
import { Event } from '../../../apis/types';
import { formatDate, isUserAuthorizedForOrganization } from '../../../common/commonFunctions';
import Loader from '../../../components/Loader';
import Modal from '../../../components/Modal/Modal';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField';
import { customStyles } from '../EventPage/constants';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import styles from './Events.module.css';
import RightClickMenu from './RightClickMenu';
import type { NewEventStateType, OrgListType } from './types';

const Events = () => {
  interface Position {
    x: number;
    y: number;
  }

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [tags, setTags] = useState([] as string[]);
  const [orgs, setOrgs] = useState([] as OrgListType[]);
  const [selectedTags, setSelectedTags] = useState([] as string[]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOrgName, setSelectedOrgName] = useState(
    localStorage.getItem('orgId') === 'Personal' ? 'Personal' : localStorage.getItem('orgId'),
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [duplicateEventId, setDuplicateEventId] = useState<string>('');
  const handleButtonClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    setDuplicateEventId(event.currentTarget.id);
    setIsMenuOpen(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventStateType>({
    eventName: '',
    orgId: '',
    error: [],
    showLimitationMessage: false,
  });

  const [orgsLoaded, setOrgsLoaded] = useState(false);
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  enum EventStatus {
    Published = 'Published',
    Draft = 'Draft',
    Completed = 'Completed',
  }

  const [events, setEvents] = useState([] as Event[]);
  // const [participatedEvents, setParticipatedEvents] = useState([] as Event[]);

  useEffect(() => {
    getCommonTags(setTags);
    listOrgs(setOrgs, setOrgsLoaded);
    // getParticipatedEvents(
    //   localStorage.getItem('username')!,
    //   setParticipatedEvents,
    //   setIsDataLoaded,
    // );
  }, []);

  useEffect(() => {
    if (orgsLoaded) {
      const orgId = orgs.find((org) => org.name === selectedOrgName)?.id;
      if (selectedOrgName) {
        getEventsList(setEvents, setIsDataLoaded, orgId);
      } else {
        getEventsList(setEvents, setIsDataLoaded);
      }
    }
  }, [orgs, selectedOrgName, orgsLoaded]);

  const navigate = useNavigate();

  const handleClick = (eventName: string) => {
    setEventInfoLocal(eventName).then(() => {
      navigate(`/${eventName}/overview/`);
    });
  };

  const onModalClose = () => {
    setShowModal(false);
  };

  const CreateEvent = () => {
    if (newEvent.eventName) {
      createEvent(newEvent, setNewEvent, setShowCreateModal, setIsCreating);
    } else {
      setNewEvent((prevState) => ({
        ...prevState!,
        error: ['Please enter the event name'],
      }));
    }
  };

  return (
    <>
      {isDataLoaded ? (
        <Theme>
          <Modal isOpen={showModal} onClose={onModalClose}>
            <p className={styles.modalHeader}>Create Duplicate</p>
            <p className={styles.modalSubText}>
              Are you sure you want to create a duplicate event ?
            </p>
            <div className={styles.buttons}>
              <p
                onClick={() => {
                  createDuplicateEvent(duplicateEventId, setEvents, setIsDataLoaded);
                  setShowModal(false);
                }}
                className={styles.button}
              >
                Create Duplicate
              </p>
              <p
                onClick={() => {
                  setShowModal(false);
                }}
                className={styles.button}
              >
                Cancel
              </p>
            </div>
          </Modal>

          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title={newEvent.showLimitationMessage ? 'Alert Message' : 'Create New Event'}
          >
            {!newEvent.showLimitationMessage ? (
              <>
                <InputField
                  id='eventName'
                  type='text'
                  name='eventName'
                  icon={<></>}
                  title='Event Name'
                  placeholder='Enter the new event name'
                  required
                  value={newEvent.eventName}
                  onChange={(e) => {
                    setNewEvent((prevState) => ({
                      ...prevState!,
                      eventName: e.target.value,
                    }));
                  }}
                  error={newEvent.error}
                />
                <Select
                  styles={{
                    ...customStyles,
                    container: (provided) => ({
                      ...provided,
                      width: '100%',
                    }),
                  }}
                  options={[
                    { value: 'Personal', label: 'Personal' },
                    ...orgs.map((org) => ({ value: org.id, label: org.name })),
                  ]}
                  className='select'
                  classNamePrefix='select'
                  placeholder='Select Organization'
                  value={
                    selectedOrgName ? { value: selectedOrgName, label: selectedOrgName } : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption && selectedOption.label) {
                      setNewEvent((prevState) => ({
                        ...prevState!,
                        orgId: selectedOption.value,
                      }));
                      setSelectedOrgName(selectedOption.label);
                      localStorage.setItem('orgId', selectedOption.label);
                    }
                  }}
                />
                {((selectedOrgName === 'Personal' && import.meta.env.VITE_CURRENT_ENV === 'dev') ||
                  isUserAuthorizedForOrganization(TillRoles.ADMIN)) && (
                  <button
                    className={styles.createEventButton}
                    onClick={() => {
                      CreateEvent();
                    }}
                  >
                    {isCreating ? (
                      <BeatLoader color='#1d1d1d' size={8} margin={2} />
                    ) : (
                      <span>Create Event</span>
                    )}
                  </button>
                )}
              </>
            ) : (
              <>
                <div className={styles.limitationMessageContainer}>
                  <TbAlertTriangleFilled
                    size={30}
                    color='#f04b4b'
                    className={styles.limitationIcon}
                  />
                  <p className={styles.limitationHeader}>Paricipant Count is Limited</p>
                  <p className={styles.limitationText}>
                    There is a 250 participant limit for regular events. Please contact our sales
                    team to increase the limit.
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = `/${newEvent.eventName}/manage`;
                    }}
                    className={styles.createEventButton}
                  >
                    Continue
                  </button>
                  <a href='https://wa.me/916238450178' target='_blank' rel='noopener noreferrer'>
                    <button className={styles.createEventButtonSecondary}>Contact Sales</button>
                  </a>

                  <p className={styles.helperText}>
                    You will be redirected to the dashboard in 7 seconds.
                  </p>
                </div>
              </>
            )}
          </Modal>

          <div className={styles.homeContainer}>
            <div
              className={styles.actionRow}
              style={{
                justifyContent:
                  Object.values(events).length > 0 && isDataLoaded ? 'space-between' : 'flex-end',
              }}
            >
              {Object.values(events).length > 0 && isDataLoaded && (
                <div className={styles.selectRow1}>
                  <InputField
                    id='searchInput'
                    type='text'
                    name='searchInput'
                    icon={<FaSearch size={15} color='#9e9e9e' />}
                    title=''
                    placeholder='Search Events'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '22rem' }}
                  />
                </div>
              )}
              <div className={styles.selectRow}>
                {((selectedOrgName === 'Personal' && import.meta.env.VITE_CURRENT_ENV === 'dev') ||
                  isUserAuthorizedForOrganization(TillRoles.ADMIN)) && (
                  <div className={styles.createEvent}>
                    <button
                      className={styles.createButton}
                      onClick={() => setShowCreateModal(true)}
                    >
                      <IoIosCreate size={20} /> Create Event
                    </button>
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <Select
                    styles={customStyles}
                    isMulti
                    options={tags.map((tag) => ({ value: tag, label: tag }))}
                    className='basic-multi-select'
                    classNamePrefix='select'
                    placeholder='Select tags'
                    onChange={(selectedOptions) => {
                      setSelectedTags(selectedOptions.map((option) => option.value));
                    }}
                  />
                )}

                {orgs && orgs.length > 0 && (
                  <>
                    <Select
                      styles={customStyles}
                      options={[
                        { value: 'Personal', label: 'Personal' },
                        ...orgs.map((org) => ({ value: org.id, label: org.name })),
                      ]}
                      value={
                        selectedOrgName ? { value: selectedOrgName, label: selectedOrgName } : null
                      }
                      className='select'
                      classNamePrefix='select'
                      placeholder='Select Organization'
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          setSelectedOrgName(selectedOption.label);
                          setNewEvent((prevState) => ({
                            ...prevState!,
                            orgId: selectedOption.value,
                          }));

                          localStorage.setItem('orgId', selectedOption.label);

                          if (selectedOption.value !== 'Personal') {
                            sessionStorage.setItem(
                              'orgData',
                              JSON.stringify(orgs.find((org) => org.name === selectedOption.label)),
                            );
                          }

                          if (selectedOption.value !== 'Personal') {
                            getEventsList(setEvents, setIsDataLoaded, selectedOption.value);
                          } else if (selectedOption.value === 'Personal') {
                            getEventsList(setEvents, setIsDataLoaded);
                          }
                        }
                      }}
                    />

                    {selectedOrgName && selectedOrgName != 'Personal' && (
                      <IoMdSettings
                        size={20}
                        color='#ffffff'
                        className='pointer'
                        onClick={() => {
                          sessionStorage.setItem(
                            'orgData',
                            JSON.stringify(orgs.find((org) => org.name === selectedOrgName)),
                          );
                          navigate(`/organization/${selectedOrgName}/`);
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {Object.values(EventStatus).map((status) => {
              return (
                <div key={status}>
                  <div
                    className='row'
                    style={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={styles.homeHeader}
                    >
                      {events.filter(
                        (event) =>
                          event.status === status &&
                          (selectedTags.length === 0 ||
                            event.tags.some((tag) => selectedTags.includes(tag))) &&
                          event.title.toLowerCase().includes(searchTerm.toLowerCase()),
                      ).length > 0
                        ? `${status} Events (${
                            events.filter(
                              (event) =>
                                event.status === status &&
                                (selectedTags.length === 0 ||
                                  event.tags.some((tag) => selectedTags.includes(tag))) &&
                                event.title.toLowerCase().includes(searchTerm.toLowerCase()),
                            ).length
                          })`
                        : ''}
                    </motion.p>
                  </div>

                  <div className={styles.eventsContainer}>
                    {events
                      .filter(
                        (event) =>
                          event.status === status &&
                          (selectedTags.length === 0 ||
                            event.tags.some((tag) => selectedTags.includes(tag))) &&
                          event.title.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((event) => (
                        <div key={event.id} className={styles.event}>
                          <div>
                            <motion.div
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className={styles.eventCard}
                              onClick={() => {
                                handleClick(event.name);
                              }}
                            >
                              <div className={styles.innerCard}>
                                {event.logo ? (
                                  <motion.img
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    src={event.logo}
                                    alt='event logo depicting event information'
                                    className={styles.eventImage}
                                  />
                                ) : (
                                  <div className={styles.eventImage}>
                                    {event.title.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className={styles.eventDetails}>
                                  <div className={styles.eventDetailsHeader}>
                                    <div>
                                      {event.event_start_date && (
                                        <motion.div className={styles.eventDate}>
                                          <p className={styles.date}>
                                            {formatDate(event?.event_start_date)}
                                          </p>
                                        </motion.div>
                                      )}
                                      <p className={styles.eventName}>
                                        {event.title.substring(0, 35)}
                                        {event.title.length > 35 ? '...' : ''}
                                      </p>
                                    </div>
                                    <div className={styles.absoluteButtons}>
                                      {event.tags.length > 0 && (
                                        <div className={styles.tagsButton}>
                                          <FaTags
                                            color='#ffffff'
                                            className='pointer'
                                            title={
                                              event.tags.length > 0 ? event.tags.join(', ') : ''
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                            }}
                                          />
                                        </div>
                                      )}

                                      <div className={styles.rightMenuButton}>
                                        <BsThreeDots
                                          onClick={(
                                            eventClick: React.MouseEvent<SVGElement, MouseEvent>,
                                          ) => {
                                            eventClick.stopPropagation();
                                            handleButtonClick(eventClick);
                                            setDuplicateEventId(event?.id);
                                          }}
                                          size={15}
                                          color='#ffffff'
                                          className='pointer'
                                          style={{
                                            zIndex: 10,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {isMenuOpen && duplicateEventId == event.id && (
                                    <RightClickMenu
                                      isOpen={isMenuOpen}
                                      position={menuPosition}
                                      onClose={handleMenuClose}
                                      setShowModal={setShowModal}
                                    />
                                  )}
                                  <p className={styles.eventGuests}>
                                    <span>
                                      <GoPeople color='a4a4a4' />
                                    </span>
                                    {event.members} guests
                                  </p>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className={styles.manage}
                                    onClick={() => {
                                      handleClick(event.name);
                                    }}
                                  >
                                    Manage
                                    <BsArrowRight size={15} />
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
            {Object.values(events).length === 0 && isDataLoaded && (
              <div className={styles.noEventsContainer}>
                <p className={styles.noEvents}>
                  You don't have any events yet. Please connect with our sales team to get started.
                </p>
                <SecondaryButton
                  buttonText='Contact Sales'
                  onClick={() => {
                    window.open('https://wa.me/916238450178', '_blank');
                  }}
                />
              </div>
            )}
          </div>
        </Theme>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Events;
