import { Dispatch } from 'react';
import { AiOutlineTeam } from 'react-icons/ai';

import { updateUserSocials } from '../../../../../apis/user';
import Modal from '../../../../../components/Modal/Modal';
import InputField from '../../../../auth/Login/InputField';
import type { socialsType } from '../../types';
import styles from './ProfileUpdateSocials.module.css';

const ProfileUpdateSocials = ({
  setShowChangeSocialModal,
  socials,
  setSocials,
}: {
  setShowChangeSocialModal: React.Dispatch<React.SetStateAction<boolean>>;
  socials: socialsType;
  setSocials: Dispatch<React.SetStateAction<socialsType>>;
}) => {
  return (
    <>
      <Modal
        onClose={() => {
          setShowChangeSocialModal(false);
        }}
        type='side'
        title='Add Communication Mediums'
        zIndexCount={100}
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
            value={socials?.whatsapp}
            onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
          />
          <InputField
            name='email'
            type='email'
            id='email'
            icon={<AiOutlineTeam size={20} color='#949597' />}
            title='Add Email'
            value={socials?.email}
            onChange={(e) => setSocials({ ...socials, email: e.target.value })}
          />
          <InputField
            name='phone'
            type='tel'
            id='phone'
            placeholder='+91854696520'
            icon={<AiOutlineTeam size={20} color='#949597' />}
            title='Add Phone Number'
            value={socials?.phone}
            onChange={(e) => setSocials({ ...socials, phone: e.target.value })}
          />
          <p className={styles.modalSubHeader}>Social Medias</p>
          <InputField
            name='facebook'
            type='text'
            id='facebook'
            icon={<AiOutlineTeam size={20} color='#949597' />}
            title='Add Facebook Link'
            placeholder='facebook.com/username'
            value={socials?.facebook}
            onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
          />
          <InputField
            name='instagram'
            type='text'
            id='instagram'
            icon={<AiOutlineTeam size={20} color='#949597' />}
            title='Add Instagram Link'
            placeholder='instagram.com/username'
            value={socials?.instagram}
            onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
          />
          <InputField
            name='twitter'
            type='text'
            id='twitter'
            icon={<AiOutlineTeam size={20} color='#949597' />}
            title='Add Twitter Link'
            value={socials?.twitter}
            placeholder='x.com/username'
            onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
          />
          <InputField
            name='linkedin'
            type='text'
            id='linkedin'
            icon={<AiOutlineTeam size={20} color='#949597' />}
            title='Add LinkedIn Link'
            value={socials?.linkedin}
            placeholder='linkedin.com/in/username'
            onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
          />
        </div>
        <button
          className={styles.submitButton}
          onClick={() => {
            updateUserSocials(socials);
          }}
        >
          Submit
        </button>
      </Modal>
    </>
  );
};

export default ProfileUpdateSocials;
