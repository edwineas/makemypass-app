import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';

import { getEventMailService, updateEventMailService } from '../../../../../../apis/mails';
import Modal from '../../../../../../components/Modal/Modal';
import Slider from '../../../../../../components/SliderButton/Slider';
import InputField from '../../../../../auth/Login/InputField';
import styles from './CustomMail.module.css';

type Props = {
  setCustomMail: React.Dispatch<React.SetStateAction<boolean>>;
};

export type mailData = {
  smtp_server: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  from_mail: string;
};

const CustomMail = ({ setCustomMail }: Props) => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const [showCustomMail, setShowCustomMail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedMailData, setFetchedMailData] = useState<mailData>();
  const [mailData, setMailData] = useState<mailData>();

  const onUpdate = () => {
    let changedData: Record<string, unknown> = Object.entries(mailData as Record<string, unknown>)
      .filter(([key, value]) => fetchedMailData?.[key as keyof mailData] !== value && value !== '')
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (!showCustomMail) {
      changedData = {};
    }

    updateEventMailService(eventId, changedData, setFetchedMailData, mailData);
  };

  useEffect(() => {
    if (eventId) {
      getEventMailService(eventId, setFetchedMailData);
    }
  }, [eventId]);

  useEffect(() => {
    if (fetchedMailData) {
      setIsLoading(false);
      Object.keys(fetchedMailData).length && setShowCustomMail(true);
      setMailData(fetchedMailData);
    }
  }, [fetchedMailData]);

  return (
    <Modal title='Custom Mail' onClose={() => setCustomMail(false)} zIndexCount={100}>
      <>
        {isLoading ? (
          <HashLoader color='#46BF75' size={50} className={styles.loader} />
        ) : (
          <div className={styles.inputContainers}>
            <Slider
              text='Turn On Custom Mail ?'
              checked={showCustomMail}
              onChange={() => setShowCustomMail(!showCustomMail)}
              labelStyle={{
                fontSize: '0.9rem',
              }}
            />

            {showCustomMail && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.inputContainers}
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                <InputField
                  type='text'
                  value={mailData?.smtp_server}
                  onChange={(e) => {
                    mailData && setMailData({ ...mailData, smtp_server: e.target.value });
                  }}
                  placeholder='e.g., smtp.gmail.com'
                  title='SMTP Server'
                  name='smtp_server'
                  id='smtp_server'
                  icon={null}
                  style={{
                    marginTop: '0',
                  }}
                />

                <InputField
                  type='text'
                  value={mailData?.smtp_port}
                  onChange={(e) => {
                    mailData && setMailData({ ...mailData, smtp_port: e.target.value });
                  }}
                  placeholder='e.g., 587'
                  title='SMTP Port'
                  name='smtp_port'
                  id='smtp_port'
                  icon={null}
                  style={{
                    marginTop: '0',
                  }}
                />

                <InputField
                  type='text'
                  value={mailData?.smtp_username}
                  onChange={(e) => {
                    mailData && setMailData({ ...mailData, smtp_username: e.target.value });
                  }}
                  placeholder='e.g., your-email@gmail.com'
                  title='SMTP Username'
                  name='smtp_username'
                  id='smtp_username'
                  icon={null}
                  style={{
                    marginTop: '0',
                  }}
                />

                <InputField
                  type='password'
                  value={mailData?.smtp_password}
                  onChange={(e) => {
                    mailData && setMailData({ ...mailData, smtp_password: e.target.value });
                  }}
                  placeholder='e.g., your-password'
                  title='SMTP Password'
                  name='smtp_password'
                  id='smtp_password'
                  icon={null}
                  style={{
                    marginTop: '0',
                  }}
                />

                <InputField
                  type='text'
                  value={mailData?.from_mail}
                  onChange={(e) => {
                    mailData && setMailData({ ...mailData, from_mail: e.target.value });
                  }}
                  placeholder='e.g., your-email@gmail.com'
                  title='From Mail'
                  name='from_mail'
                  id='from_mail'
                  icon={null}
                  style={{
                    marginTop: '0',
                  }}
                />
              </motion.div>
            )}

            <div className={styles.buttonContainer}>
              <button className={styles.primaryButton} onClick={onUpdate}>
                Update
              </button>
              <button className={styles.secondaryButton} onClick={() => setCustomMail(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

export default CustomMail;
