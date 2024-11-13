/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';
import Select from 'react-select';

import { Roles } from '../../../../../../services/enums';
import { getLoggedInUserEventRole } from '../../../../../common/commonFunctions';
import Modal from '../../../../../components/Modal/Modal';
import Slider from '../../../../../components/SliderButton/Slider';
import InputField from '../../../../auth/Login/InputField';
import { customStyles } from '../../../EventPage/constants';
import type { hostData } from '../../Overview/types';
import styles from './AddHosts.module.css';
import roleOptions from './data';

const AddHosts = ({
  hostData,
  setHostData,
  onSubmit,
  onClose,
  add,
}: {
  hostData: hostData;
  setHostData: React.Dispatch<SetStateAction<hostData>>;
  onSubmit: () => void;
  onClose: () => void;
  add: boolean;
}) => {
  const handleRoleChange = (event: any) => {
    const selectedRole = event.value;
    setHostData((prevState) => ({
      ...prevState!,
      role: selectedRole,
    }));
  };

  function getOptionsForUserRole(): { value: Roles; label: Roles }[] {
    const userRole = getLoggedInUserEventRole() as Roles;
    const options: { value: Roles; label: Roles }[] = [];

    const roleHierarchy: { [key in Roles]?: Roles[] } = {
      [Roles.EDITOR]: [Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
      [Roles.ADMIN]: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
      [Roles.OWNER]: [Roles.ADMIN, Roles.EDITOR, Roles.VIEWER, Roles.VOLUNTEER, Roles.DEVICE],
    };

    if (roleHierarchy[userRole]) {
      roleHierarchy[userRole]!.forEach((role) => {
        options.push({ value: role, label: role });
      });
    }

    return options;
  }

  return (
    <Modal onClose={onClose} title={add ? 'Add Host' : 'Edit Host'}>
      <div className={styles.userInfoModalContainer}>
        <InputField
          type='text'
          name='Email'
          id='email'
          title='Enter Email'
          icon={<></>}
          required={false}
          onChange={(event) => {
            setHostData((prevState) => ({
              ...prevState!,
              email: event.target.value,
            }));
          }}
          value={hostData?.email}
          placeholder='Enter the email address for the host'
          disabled={hostData.id ? true : false}
        />

        <div className={styles.dropdown} style={{ width: '100%' }}>
          <p className={styles.inputLabel}>Select Role</p>
          <Select
            className='basic-single'
            classNamePrefix='select'
            value={roleOptions.filter((role) => role.value === hostData?.role)[0]}
            onChange={(event) => {
              handleRoleChange(event);
            }}
            name='role'
            options={getOptionsForUserRole()}
            styles={customStyles}
          />
        </div>

        <div className={styles.inputContainers}>
          <div className={styles.inputContainer}>
            <Slider
              checked={!hostData?.is_private}
              onChange={() => {
                setHostData((prevState) => ({
                  ...prevState,
                  is_private: !hostData.is_private,
                }));
              }}
              text='Do you want to make this host public?'
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={`pointer ${styles.primaryButton}`} onClick={onSubmit}>
            {hostData.id ? 'Edit Host' : 'Add Host'}
          </button>
          <button className={`pointer ${styles.secondaryButton}`} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddHosts;
