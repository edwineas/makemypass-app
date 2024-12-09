import React, { useState } from 'react';
import { TiTick } from 'react-icons/ti';

import { sendVerfication } from '../../../../../apis/publicpage';
import { FormDataType } from '../../../../../apis/types';
import Modal from '../../../../../components/Modal/Modal';
import { VerificationModalProps } from '../../types';
import styles from './VerificationModal.module.css';

type Props = {
  verification: VerificationModalProps;
  setVerification: React.Dispatch<React.SetStateAction<VerificationModalProps>>;
  formData: FormDataType;
  onFieldChange: (field: string, value: string) => void;
};

const VerificationModal = ({ verification, setVerification, formData, onFieldChange }: Props) => {
  const [emailOtpSent, setEmailOtpSent] = useState<boolean>(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState<boolean>(false);

  return (
    <Modal
      isOpen={verification.showModal}
      onClose={() => setVerification({ ...verification, showModal: false })}
    >
      <>
        <div className={styles.modalContainer}>
          <div className={styles.verificationContainer}>
            <div className={styles.inputContainer}>
              <label htmlFor='email_otp' className={styles.modalLabel}>
                Email Verification Code
              </label>
              <input
                type='password'
                id='email_otp'
                name='email_otp'
                value={formData['email_otp']}
                onChange={(e) => onFieldChange('email_otp', e.target.value)}
                className={styles.input}
              ></input>
            </div>
            <button
              className={styles.sendOtp}
              onClick={() => {
                sendVerfication('email', formData['email'] as string).then(() =>
                  setEmailOtpSent(true),
                );
              }}
            >
              {emailOtpSent ? <TiTick /> : 'Send OTP'}
            </button>
          </div>
          <div className={styles.verificationContainer}>
            <div className={styles.inputContainer}>
              <label htmlFor='phone_otp' className={styles.modalLabel}>
                Phone Verification Code
              </label>
              <input
                type='password'
                id='phone_otp'
                name='phone_otp'
                value={formData['phone_otp']}
                onChange={(e) => onFieldChange('phone_otp', e.target.value)}
                className={styles.input}
              ></input>
            </div>
            <button
              className={styles.sendOtp}
              onClick={() => {
                sendVerfication('phone', formData['phone'] as string).then(() =>
                  setPhoneOtpSent(true),
                );
              }}
            >
              {phoneOtpSent ? <TiTick /> : 'Send OTP'}
            </button>
          </div>
          <button
            className={styles.submitButton}
            onClick={() => verification.submit && verification.submit()}
          >
            Submit
          </button>
        </div>
      </>
    </Modal>
  );
};

export default VerificationModal;
