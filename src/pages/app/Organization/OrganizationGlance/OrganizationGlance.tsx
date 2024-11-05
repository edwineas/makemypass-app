import { useEffect, useState } from 'react';
import { TbAlertTriangleFilled } from 'react-icons/tb';
import { useParams } from 'react-router';
import { BeatLoader } from 'react-spinners';

import {
  addOrgMember,
  listOrgMembers,
  OrgInfoFromName,
  removeOrgMember,
  updateOrgMember,
} from '../../../../apis/orgs';
import Modal from '../../../../components/Modal/Modal';
import Table from '../../../../components/Table/Table';
import { TableType } from '../../../../components/Table/types';
import Theme from '../../../../components/Theme/Theme';
import SecondaryButton from '../../Overview/components/SecondaryButton/SecondaryButton';
import type { hostId } from '../../Overview/Overview/types';
import AddEditMember from '../AddEditMember/AddEditMember';
import EditOrganization from '../EditOrganization/EditOrganization';
import type { OrganizationType } from '../EditOrganization/types';
import styles from './OrganizationGlance.module.css';
import type { MemberType } from './types';

const OrganizationGlance = () => {
  const { orgName } = useParams<{ orgName: string }>();

  const [organization, setOrganization] = useState<OrganizationType>({
    id: '',
    title: '',
    name: '',
    banner: '',
    logo: '',
    description: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [organizationMembers, setOrganizationMembers] = useState<MemberType[]>();
  const [transformedMembers, setTransformedMembers] = useState<TableType[]>([]);

  const [addMember, setAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<hostId>({ id: '', type: null });
  const [memberData, setMemberData] = useState<MemberType>();

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (orgName) {
      OrgInfoFromName(orgName, setOrganization);
    }
  }, [orgName, triggerFetch]);

  useEffect(() => {
    if (organization.id) {
      listOrgMembers(organization.id, setOrganizationMembers);
    }
  }, [organization]);

  useEffect(() => {
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
  }, [organizationMembers]);

  const agreeToDelete = () => {
    setIsDeleting(true);
    removeOrgMember(organization.id, selectedMemberId.id, setIsDeleting, setTriggerFetch);
  };

  const onSubmit = () => {
    if (memberData && !memberData.id)
      addOrgMember(organization.id, memberData.email, memberData.role, setTriggerFetch);
    if (memberData && memberData.id)
      updateOrgMember(organization.id, memberData.id, memberData.role, setTriggerFetch);

    setSelectedMemberId({ id: '', type: null });
    setAddMember(false);
  };

  return (
    <Theme>
      {(selectedMemberId.type === 'edit' || addMember) && (
        <AddEditMember
          memberData={memberData}
          setMemberData={setMemberData}
          onSubmit={() => onSubmit()}
          onClose={() => setSelectedMemberId({ id: '', type: null })}
          add={false}
        />
      )}
      {selectedMemberId.type === 'delete' && (
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
      {showEditModal && (
        <Modal type='side' onClose={() => setShowEditModal(false)} title='Edit Organization'>
          <EditOrganization
            organization={organization}
            setShowEditModal={setShowEditModal}
            setTriggerFetch={setTriggerFetch}
          />
        </Modal>
      )}
      <div className={styles.organizationContainer}>
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
              <p className={styles.eventDescription}>{organization.description}</p>
            </div>
          </div>

          <div className={styles.buttons} onClick={() => setShowEditModal(true)}>
            <button className={styles.editEventButton}>Edit Organization</button>
          </div>
        </div>
      </div>

      <div id='members' className={styles.membersContainer}>
        <Table
          tableHeading='Event Hosts'
          tableData={transformedMembers}
          secondaryButton={
            <SecondaryButton
              buttonText='Add Member +'
              onClick={() => {
                setAddMember(true);
              }}
            />
          }
          setHostId={setSelectedMemberId}
          showSearch={true}
        />
      </div>
    </Theme>
  );
};

export default OrganizationGlance;
