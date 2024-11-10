import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BiLock, BiUser } from 'react-icons/bi';
import { BeatLoader } from 'react-spinners';

import { generateOTP, resetUserPassword } from '../../../apis/auth';
// import { useLocation } from 'react-router-dom';
import { getEventsList } from '../../../apis/events';
import { Event } from '../../../apis/types';
import { getProfileInfo, updateUserProfile } from '../../../apis/user';
import Loader from '../../../components/Loader';
import Modal from '../../../components/Modal/Modal';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import EventBox from './components/EventBox/EventBox';
import styles from './ProfilePage.module.css';
import type { userData, userPasswordData } from './types';

const ProfilePage = () => {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const token = queryParams.get('token')?.replace(/\/+$/, '') as string;

  const [loading, setLoading] = React.useState(false);
  const [dataLoading, setDataLoading] = React.useState(false);
  // const [currentTab, setCurrentTab] = useState('owner');
  const [eventsData, setEventsData] = useState<Event[]>([]);

  const [editBasicInfo, setEditBasicInfo] = useState(false);
  const [userData, setUserData] = React.useState<userData>();
  const [originalUserData, setOriginalUserData] = useState<userData>();
  const ProfilePicRef = useRef<HTMLInputElement>(null);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<userPasswordData>({
    OTP: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resendTimer, setResendTimer] = useState(0);

  enum EventStatus {
    Published = 'Published',
    Completed = 'Completed',
    Draft = 'Draft',
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (resendTimer > 0) {
        setResendTimer(resendTimer - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    setResendTimer(60);
  }, [showChangePasswordModal]);

  // const handleUpdateProfile = () => {

  //   const formData = new FormData(event.target as HTMLFormElement);
  //   if (token) {
  //     setUserData({ formData, token, setLoading });
  //   } else {

  //   }
  // };

  useEffect(() => {
    getEventsList(setEventsData, setDataLoading);
    getProfileInfo({ setUserData, setOriginalUserData });
  }, []);

  return (
    <>
      {userData && dataLoading ? (
        <>
          <Theme>
            {editBasicInfo && (
              <Modal title='Edit Basic Info' onClose={() => setEditBasicInfo(false)}>
                <div className={styles.EditBasicInfoContainer}>
                  <div className={styles.userDetailsContainer}>
                    <div className={styles.basicProfileImageEdit}>
                      <img
                        src={
                          userData?.profile_pic
                            ? typeof userData?.profile_pic === 'string'
                              ? userData?.profile_pic
                              : URL.createObjectURL(userData?.profile_pic)
                            : '/app/profilepics/default1.png'
                        }
                        alt='profile picture'
                        style={{ objectFit: 'cover' }}
                        className={styles.profilePic}
                      />
                      <SecondaryButton
                        style={{ marginTop: '1rem' }}
                        buttonText='Change'
                        onClick={() => ProfilePicRef.current?.click()}
                      />
                      <input
                        type='file'
                        id='profile_pic'
                        name='profile_pic'
                        className={styles.fileInput}
                        accept='.png, .jpg, .jpeg'
                        onChange={(e) =>
                          setUserData({ ...userData, profile_pic: e.target.files?.[0] })
                        }
                        ref={ProfilePicRef}
                      />
                    </div>

                    <div className={styles.EditBasicInfoContainer}>
                      <InputField
                        type='text'
                        name='name'
                        id='name'
                        title='Name'
                        icon={<BiUser />}
                        value={userData?.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        style={{ marginBottom: '0' }}
                      />
                      <InputField
                        type='email'
                        name='email'
                        id='email'
                        title='Email'
                        icon={<BiUser />}
                        disabled={true}
                        value={userData?.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.basicEditModalButtons}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => {
                        console.log(userData);
                        console.log(originalUserData);
                        updateUserProfile(userData, originalUserData, setLoading);
                        setEditBasicInfo(false);
                      }}
                    >
                      {loading ? <BeatLoader color='#000' size={8} /> : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditBasicInfo(false);
                      }}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal>
            )}
            {showChangePasswordModal && (
              <Modal title='Change Password' onClose={() => setShowChangePasswordModal(false)}>
                <div className={styles.EditPasswordContainer}>
                  <div className={styles.passwordFieldsContainer}>
                    <InputField
                      type='text'
                      description='An OTP has been sent to your email. Please enter it here.'
                      name='otp'
                      id='otp'
                      placeholder='Enter the One Time Password'
                      title='One Time Password'
                      icon={<BiLock />}
                      value={passwordData.OTP}
                      onChange={(e) => setPasswordData({ ...passwordData, OTP: e.target.value })}
                      style={{ marginBottom: '1rem' }}
                    />

                    <InputField
                      type='password'
                      name='new_password'
                      id='new_password'
                      placeholder='Enter New Password'
                      title='New Password'
                      icon={<BiLock />}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      style={{ marginBottom: '1rem' }}
                    />

                    <InputField
                      type='password'
                      name='confirm_password'
                      id='confirm_password'
                      placeholder='Confirm Password'
                      title='Confirm Password'
                      icon={<BiLock />}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      style={{ marginBottom: '1rem' }}
                    />
                  </div>

                  <div className={styles.basicEditModalButtons}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => {
                        if (passwordData.newPassword === passwordData.confirmPassword) {
                          resetUserPassword(
                            userData.email,
                            passwordData.OTP,
                            passwordData.newPassword,
                          );
                          setShowChangePasswordModal(false);
                          setResendTimer(0);
                        } else {
                          toast.error('New Password and Confirm Password do not match!');
                        }
                      }}
                    >
                      {loading ? <BeatLoader color='#000' size={8} /> : 'Update'}
                    </button>
                    <button
                      onClick={() =>
                        generateOTP(userData.email, setShowChangePasswordModal, 'Forget Password')
                      }
                      className={styles.cancelButton}
                      disabled={resendTimer > 0}
                      style={
                        resendTimer > 0
                          ? { cursor: 'not-allowed', opacity: 0.5 }
                          : { cursor: 'pointer', opacity: 1 }
                      }
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            <div className={styles.profilePageContainer}>
              <div className={styles.profileSection}>
                <img
                  src={
                    userData?.profile_pic
                      ? typeof userData?.profile_pic === 'string'
                        ? userData?.profile_pic
                        : URL.createObjectURL(userData?.profile_pic)
                      : '/app/profilepics/default1.png'
                  }
                  alt='profile picture'
                  style={{ objectFit: 'cover' }}
                  className={styles.profilePic}
                />

                <div className={styles.profileInfo}>
                  <label className={styles.infoName}>{originalUserData?.name}</label>
                  <label className={styles.infoEmail}>{originalUserData?.email}</label>

                  <label className={styles.hostedCount}>
                    Hosted: {eventsData.filter((event) => event.status === 'Completed').length}{' '}
                    Events
                  </label>
                </div>

                <div className={styles.buttonsContainer}>
                  <SecondaryButton
                    buttonText='Edit Basic Info'
                    onClick={() => {
                      setEditBasicInfo(!editBasicInfo);
                    }}
                  />

                  <SecondaryButton
                    buttonText='Change Password'
                    onClick={() => {
                      generateOTP(userData.email, setShowChangePasswordModal, 'Forget Password');
                    }}
                  />
                </div>
              </div>

              <div className={styles.eventSection}>
                <div className={styles.eventBoxesContainer}>
                  {Object.values(EventStatus).map((status) => {
                    return (
                      <div>
                        <motion.p
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className={styles.homeHeader}
                        >
                          {eventsData.filter((event) => event.status == status).length > 0
                            ? `${status} Events (${eventsData.filter((event) => event.status == status).length})`
                            : ''}
                        </motion.p>
                        <div className={styles.eventsContainer}>
                          {eventsData
                            .filter((event) => event.status == status)
                            .map((event) => (
                              <EventBox key={event.id} eventData={event} />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Theme>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ProfilePage;
