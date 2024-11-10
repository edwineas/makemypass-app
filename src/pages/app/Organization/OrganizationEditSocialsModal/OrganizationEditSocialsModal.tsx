import { Dispatch } from 'react';
import { AiOutlineTeam } from 'react-icons/ai';

import Modal from '../../../../components/Modal/Modal';
import InputField from '../../../auth/Login/InputField';
import type { OrganizationType } from '../EditOrganization/types';
import styles from './OrganizationEditSocialsModal.module.css';

const OrganizationEditSocialsModal = ({
  setShowCommunicationMediumModal,
  organizationState,
  setorganizationState,
}: {
  setShowCommunicationMediumModal: (value: boolean) => void;
  organizationState: OrganizationType;
  setorganizationState: Dispatch<React.SetStateAction<OrganizationType>>;
}) => {
  return (
    <Modal
      type='side'
      onClose={() => setShowCommunicationMediumModal(false)}
      title='Add Communication Mediums'
    >
      <p className={styles.modalSubHeader}>Regular Communcation Medium</p>
      <div className={styles.modalContents}>
        <InputField
          name='whatsapp'
          type='text'
          id='whatsapp'
          placeholder='wa.me/+919234567890'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add WhatsApp Link'
          value={organizationState?.socials?.whatsapp}
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  whatsapp: e.target.value,
                },
              });
            }
          }}
        />
        <InputField
          name='email'
          type='email'
          id='email'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Email'
          value={organizationState?.socials?.email}
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  email: e.target.value,
                },
              });
            }
          }}
        />
        <InputField
          name='phone'
          type='tel'
          id='phone'
          placeholder='+91854696520'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Phone Number'
          value={organizationState?.socials?.phone}
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  phone: e.target.value,
                },
              });
            }
          }}
        />
        <p className={styles.modalSubHeader}>Social Medias</p>
        <InputField
          name='facebook'
          type='text'
          id='facebook'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Facebook Link'
          placeholder='facebook.com/username'
          value={organizationState?.socials?.facebook}
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  facebook: e.target.value,
                },
              });
            }
          }}
        />
        <InputField
          name='instagram'
          type='text'
          id='instagram'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Instagram Link'
          placeholder='instagram.com/username'
          value={organizationState?.socials?.instagram}
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  instagram: e.target.value,
                },
              });
            }
          }}
        />
        <InputField
          name='twitter'
          type='text'
          id='twitter'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Twitter Link'
          value={organizationState?.socials?.twitter}
          placeholder='x.com/username'
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  twitter: e.target.value,
                },
              });
            }
          }}
        />
        <InputField
          name='linkedin'
          type='text'
          id='linkedin'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add LinkedIn Link'
          value={organizationState?.socials?.linkedin}
          placeholder='linkedin.com/in/username'
          onChange={(e) => {
            if (organizationState) {
              setorganizationState({
                ...organizationState,
                socials: {
                  ...organizationState.socials,
                  linkedin: e.target.value,
                },
              });
            }
          }}
        />
      </div>
      <button
        className={styles.submitButton}
        onClick={() => setShowCommunicationMediumModal(false)}
      >
        Submit
      </button>
    </Modal>
  );
};

export default OrganizationEditSocialsModal;
