import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { OrgInfoFromName } from '../../../../apis/orgs';
import Modal from '../../../../components/Modal/Modal';
import Theme from '../../../../components/Theme/Theme';
import EditOrganization from '../EditOrganization/EditOrganization';
import type { OrganizationType } from '../EditOrganization/types';
import styles from './OrganizationGlance.module.css';

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

  useEffect(() => {
    if (orgName) OrgInfoFromName(orgName, setOrganization);
  }, [orgName, triggerFetch]);

  return (
    <Theme>
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
    </Theme>
  );
};

export default OrganizationGlance;
