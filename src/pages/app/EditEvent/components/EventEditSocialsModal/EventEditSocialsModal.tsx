import { Dispatch } from 'react';
import { AiOutlineTeam } from 'react-icons/ai';

import { EventType } from '../../../../../apis/types';
import { isUserEditor } from '../../../../../common/commonFunctions';
import Modal from '../../../../../components/Modal/Modal';
import InputField from '../../../../auth/Login/InputField';
import styles from './EventEditSocialsModal.module.css';

const EventEditSocialsModal = ({
  setShowCommunicationMediumModal,
  eventData,
  setEventData,
}: {
  setShowCommunicationMediumModal: (value: boolean) => void;
  eventData: EventType | undefined;
  setEventData: Dispatch<React.SetStateAction<EventType | undefined>>;
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
          value={eventData?.socials?.whatsapp}
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        whatsapp: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
        <InputField
          name='email'
          type='email'
          id='email'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Email'
          value={eventData?.socials?.email}
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        email: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
        <InputField
          name='phone'
          type='tel'
          id='phone'
          placeholder='+91854696520'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Phone Number'
          value={eventData?.socials?.phone}
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        phone: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
        <p className={styles.modalSubHeader}>Social Medias</p>
        <InputField
          name='facebook'
          type='text'
          id='facebook'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Facebook Link'
          placeholder='facebook.com/username'
          value={eventData?.socials?.facebook}
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        facebook: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
        <InputField
          name='instagram'
          type='text'
          id='instagram'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Instagram Link'
          placeholder='instagram.com/username'
          value={eventData?.socials?.instagram}
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        instagram: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
        <InputField
          name='twitter'
          type='text'
          id='twitter'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add Twitter Link'
          value={eventData?.socials?.twitter}
          placeholder='x.com/username'
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        twitter: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
        <InputField
          name='linkedin'
          type='text'
          id='linkedin'
          icon={<AiOutlineTeam size={20} color='#949597' />}
          title='Add LinkedIn Link'
          value={eventData?.socials?.linkedin}
          placeholder='linkedin.com/in/username'
          onChange={
            isUserEditor()
              ? (e) => {
                  if (eventData) {
                    setEventData({
                      ...eventData,
                      socials: {
                        ...eventData.socials,
                        linkedin: e.target.value,
                      },
                    });
                  }
                }
              : undefined
          }
        />
      </div>
      <button
        className={styles.submitButton}
        onClick={isUserEditor() ? () => setShowCommunicationMediumModal(false) : undefined}
      >
        Submit
      </button>
    </Modal>
  );
};

export default EventEditSocialsModal;
