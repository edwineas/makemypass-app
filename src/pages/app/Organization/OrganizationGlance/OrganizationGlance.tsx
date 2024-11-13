import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsArrowRight } from 'react-icons/bs';
import { FaExpandAlt } from 'react-icons/fa';
import {
  IoAlertCircleOutline,
  IoCallOutline,
  IoContract,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoMailOutline,
} from 'react-icons/io5';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { useParams } from 'react-router';
import { BeatLoader } from 'react-spinners';

import {
  addOrgMember,
  listOrgMembers,
  OrgInfoFromName,
  OrgInfoFromNamePublic,
  removeOrgMember,
  updateOrgMember,
} from '../../../../apis/orgs';
import {
  formatDate,
  isUserEditorForOrganization,
  normalizeUrl,
} from '../../../../common/commonFunctions';
import EventHeader from '../../../../components/EventHeader/EventHeader';
import Modal from '../../../../components/Modal/Modal';
import Table from '../../../../components/Table/Table';
import { TableType } from '../../../../components/Table/types';
import Theme from '../../../../components/Theme/Theme';
import SecondaryButton from '../../Overview/components/SecondaryButton/SecondaryButton';
import type { hostId } from '../../Overview/Overview/types';
import AddEditMember from '../AddEditMember/AddEditMember';
import EditOrganization from '../EditOrganization/EditOrganization';
import type { OrganizationType } from '../EditOrganization/types';
import OrganizationEditSocialsModal from '../OrganizationEditSocialsModal/OrganizationEditSocialsModal';
import styles from './OrganizationGlance.module.css';
import type { MemberType } from './types';

const OrganizationGlance = ({ type }: { type?: 'public' | 'private' }) => {
  const { orgName } = useParams<{ orgName: string }>();

  const [organization, setOrganization] = useState<OrganizationType>({
    id: '',
    title: '',
    name: '',
    banner: '',
    logo: '',
    description: '',
    socials: {
      email: '',
      phone: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      whatsapp: '',
      instagram: '',
    },
  });

  const [organizationState, setOrganizationState] = useState<OrganizationType>({
    id: '',
    banner: null,
    description: '',
    logo: null,
    name: '',
    title: '',
    socials: {
      email: '',
      phone: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      whatsapp: '',
      instagram: '',
    },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [organizationMembers, setOrganizationMembers] = useState<MemberType[]>();
  const [transformedMembers, setTransformedMembers] = useState<TableType[]>([]);

  const [addMember, setAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<hostId>({ id: '', type: null });
  const [memberData, setMemberData] = useState<MemberType>();
  const [showCommunicationMediumModal, setShowCommunicationMediumModal] = useState<boolean>(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (orgName && type === 'public') {
      OrgInfoFromNamePublic(orgName, setOrganization);
    } else if (orgName && type === 'private') {
      OrgInfoFromName(orgName, setOrganization);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgName, triggerFetch]);

  useEffect(() => {
    if (organization.id && type === 'private') {
      listOrgMembers(organization.id, setOrganizationMembers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  useEffect(() => {
    const selectedMemberData = organizationMembers?.find(
      (member) => member.id === selectedMemberId.id,
    );
    setMemberData(selectedMemberData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMemberId]);

  useEffect(() => {
    if (type === 'private') {
      const hostListMapping = {
        name: 'name',
        email: 'email',
        role: 'category',
        is_private: 'is_private',
        id: 'id',
      };

      if (organizationMembers) {
        const transformedData = organizationMembers.map((member) => {
          const transformedMember = Object.keys(hostListMapping).reduce((acc, key) => {
            acc[hostListMapping[key as keyof typeof hostListMapping]] =
              member[key as keyof MemberType];
            return acc;
          }, {} as TableType);
          return transformedMember;
        });
        setTransformedMembers(transformedData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationMembers]);

  const agreeToDelete = () => {
    setIsDeleting(true);
    const selectedMemberUserId = organizationMembers?.find(
      (member) => member.id === selectedMemberId.id,
    )?.user_id;
    if (selectedMemberUserId)
      removeOrgMember(
        organization.id,
        selectedMemberUserId,
        setIsDeleting,
        setTriggerFetch,
        setSelectedMemberId,
      );
  };

  const onSubmit = () => {
    if (memberData && !memberData.id)
      addOrgMember(organization.id, memberData.email, memberData.role, setTriggerFetch);
    if (memberData && memberData.id)
      updateOrgMember(organization.id, memberData.user_id, memberData.role, setTriggerFetch);

    setSelectedMemberId({ id: '', type: null });
    setAddMember(false);
  };

  return (
    <Theme>
      {type === 'private' && (selectedMemberId.type === 'edit' || addMember) && (
        <AddEditMember
          memberData={memberData}
          setMemberData={setMemberData}
          onSubmit={() => onSubmit()}
          onClose={() => {
            setSelectedMemberId({ id: '', type: null });
            setAddMember(false);
          }}
          add={false}
        />
      )}
      {type === 'private' && selectedMemberId.type === 'delete' && (
        <Modal
          onClose={() => setSelectedMemberId({ id: '', type: null })}
          title='Delete Confirmation'
        >
          <div className={styles.modalContainer}>
            <TbAlertTriangleFilled size={30} color='#f04b4b' className={styles.limitationIcon} />
            <p className={styles.modalHeader}>Are you sure you want to remove?</p>
            <p className={styles.modalSubText}>
              This action is irreversible. Please confirm if you want to delete this member.
            </p>
            <div className={styles.modalButtonContainer}>
              <button
                className={styles.primaryButton}
                onClick={() => agreeToDelete()}
                disabled={isDeleting}
              >
                {isDeleting ? <BeatLoader color='#1d1d1d' size={8} /> : 'Delete'}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => setSelectedMemberId({ id: '', type: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {type === 'private' && showEditModal && (
        <Modal type='side' onClose={() => setShowEditModal(false)} title='Edit Organization'>
          <EditOrganization
            organization={organization}
            organizationState={organizationState}
            setOrganizationState={setOrganizationState}
            setShowEditModal={setShowEditModal}
            setTriggerFetch={setTriggerFetch}
            setShowCommunicationMediumModal={setShowCommunicationMediumModal}
          />
        </Modal>
      )}
      {showCommunicationMediumModal && (
        <OrganizationEditSocialsModal
          setShowCommunicationMediumModal={setShowCommunicationMediumModal}
          organizationState={organizationState}
          setorganizationState={setOrganizationState}
        />
      )}

      <div className={styles.organizationContainer}>
        {type === 'private' && (
          <EventHeader
            previousPageNavigate='-1'
            custom={true}
            customName={organization.title ? `${organization.title} (org)` : ''}
          />
        )}
        <div className={styles.bannerContainer}>
          {organization.banner ? (
            <img
              src={typeof organization.banner === 'string' ? organization.banner : ''}
              alt=''
              className={styles.banner}
            />
          ) : (
            <svg height='250' width='100%' className={styles.banner}>
              <rect width='100%' height='100%' className={styles.banner} />
              <text x='40%' y='50%' fill='white' className={styles.svgText}>
                No Banner. <br />
              </text>
              <text x='10%' y='60%' fill='white' className={styles.svgText}>
                Please Edit Event Details to add a banner
              </text>
            </svg>
          )}

          <div className={styles.bannerTexts}>
            <div className={styles.headingTexts}>
              <p className={styles.eventTitle}>{organization.title}</p>
              {organization?.socials && (
                <div className={styles.hostCommunicate}>
                  <div className={styles.hostCommunicateIcons}>
                    {organization.socials.phone && (
                      <a href={`tel:${organization.socials.phone}`}>
                        <IoCallOutline size={20} />
                      </a>
                    )}
                    {organization.socials.whatsapp && (
                      <a
                        href={
                          organization.socials.whatsapp.startsWith('https://')
                            ? organization.socials.whatsapp
                            : `https://${organization.socials.whatsapp}`
                        }
                        target='_blank'
                      >
                        <IoLogoWhatsapp size={20} />
                      </a>
                    )}
                    {organization.socials.email && (
                      <a href={`mailto:${organization.socials.email}`}>
                        <IoMailOutline size={20} />
                      </a>
                    )}
                    {organization.socials.instagram && (
                      <a href={normalizeUrl(organization.socials.instagram)} target='_blank'>
                        <IoLogoInstagram size={20} />
                      </a>
                    )}
                    {organization.socials.facebook && (
                      <a href={normalizeUrl(organization.socials.facebook)} target='_blank'>
                        <IoLogoFacebook size={20} />
                      </a>
                    )}
                    {organization.socials.twitter && (
                      <a href={normalizeUrl(organization.socials.twitter)} target='_blank'>
                        <IoLogoTwitter size={20} />
                      </a>
                    )}
                    {organization.socials.linkedin && (
                      <a href={normalizeUrl(organization.socials.linkedin)} target='_blank'>
                        <IoLogoLinkedin size={20} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {type === 'private' && (
            <div className={styles.buttons}>
              {isUserEditorForOrganization() && (
                <button onClick={() => setShowEditModal(true)} className={styles.editEventButton}>
                  Edit Organization
                </button>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/org/${organization.name}`,
                  );
                  toast.success('Link copied to clipboard');
                }}
                className={styles.editEventButton}
              >
                Share Organization
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.organizationDescriptionContainer}
        >
          <p className={styles.orgDescHeading}>
            <IoAlertCircleOutline color='white' size={20} />
            <span>About the Organization</span>
          </p>
          <hr className={styles.line} />
          <p
            className={styles.organizationDescription}
            dangerouslySetInnerHTML={
              organization.description
                ? {
                    __html: showFullDesc
                      ? organization.description
                      : organization.description.length > 275
                        ? organization.description.substring(0, 275) + '...'
                        : organization.description,
                  }
                : undefined
            }
          ></p>
          {organization && organization.description && organization?.description?.length > 275 && (
            <div className={styles.expandIcon}>
              {!showFullDesc ? (
                <FaExpandAlt
                  onClick={() => {
                    setShowFullDesc((prev) => !prev);
                  }}
                />
              ) : (
                <IoContract
                  size={20}
                  onClick={() => {
                    setShowFullDesc((prev) => !prev);
                  }}
                />
              )}
            </div>
          )}
        </motion.div>
      </div>

      {type === 'private' && (
        <div id='members' className={styles.membersContainer}>
          <Table
            tableHeading='Organization Members'
            tableData={transformedMembers}
            secondaryButton={
              isUserEditorForOrganization() ? (
                <SecondaryButton
                  buttonText='Add Member +'
                  onClick={() => {
                    setAddMember(true);
                  }}
                />
              ) : undefined
            }
            setHostId={setSelectedMemberId}
            showSearch={true}
          />
        </div>
      )}
      {organization.events && organization.events?.Published?.length > 0 && (
        <div className={styles.eventsHeader}>
          <p className={styles.eventsHeaderTitle}>Ongoing Events</p>
        </div>
      )}
      <div className={styles.eventsContainer}>
        {type === 'public' &&
          organization.events &&
          organization.events?.Published?.length > 0 &&
          organization.events?.Published.map((event) => (
            <div key={event.id} className={styles.event}>
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={styles.eventCard}
                  style={{
                    zIndex: 0,
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
                      <div className={styles.eventImage}>{event.title.charAt(0).toUpperCase()}</div>
                    )}
                    <div className={styles.eventDetails}>
                      <div className={styles.eventDetailsHeader}>
                        <div>
                          {event.event_start_date && (
                            <motion.div className={styles.eventDate}>
                              <p className={styles.date}>{formatDate(event?.event_start_date)}</p>
                            </motion.div>
                          )}
                          <p className={styles.eventName}>
                            {event.title?.substring(0, 35)}
                            {event.title?.length > 35 ? '...' : ''}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className={styles.manage}
                        onClick={() => {
                          window.location.href = `/${event.name}`;
                        }}
                      >
                        View Event
                        <BsArrowRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
      </div>
      {organization.events && organization.events?.Completed?.length > 0 && (
        <div className={styles.eventsHeader}>
          <p className={styles.eventsHeaderTitle}>Completed Events</p>
        </div>
      )}
      <div className={styles.eventsContainer}>
        {type === 'public' &&
          organization.events &&
          organization.events?.Completed?.length > 0 &&
          organization.events?.Completed.map((event) => (
            <div key={event.id} className={styles.event}>
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={styles.eventCard}
                  style={{
                    zIndex: 0,
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
                      <div className={styles.eventImage}>{event.title.charAt(0).toUpperCase()}</div>
                    )}
                    <div className={styles.eventDetails}>
                      <div className={styles.eventDetailsHeader}>
                        <div>
                          {event.event_start_date && (
                            <motion.div className={styles.eventDate}>
                              <p className={styles.date}>{formatDate(event?.event_start_date)}</p>
                            </motion.div>
                          )}
                          <p className={styles.eventName}>
                            {event.title.substring(0, 35)}
                            {event.title?.length > 35 ? '...' : ''}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className={styles.manage}
                        onClick={() => {
                          window.location.href = `/${event.name}`;
                        }}
                      >
                        View Event
                        <BsArrowRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
      </div>
    </Theme>
  );
};

export default OrganizationGlance;
