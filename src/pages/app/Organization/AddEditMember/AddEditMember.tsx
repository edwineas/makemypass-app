/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';
import Select from 'react-select';

import { Roles } from '../../../../../services/enums';
import { getLoggedInUserOrganizationRole } from '../../../../common/commonFunctions';
import Modal from '../../../../components/Modal/Modal';
import InputField from '../../../auth/Login/InputField';
import { customStyles } from '../../EventPage/constants';
import roleOptions from '../../Overview/components/AddHosts/data';
import type { MemberType } from '../OrganizationGlance/types';
import styles from './AddEditMember.module.css';

const AddEditMember = ({
  isOpen,
  memberData,
  setMemberData,
  onSubmit,
  onClose,
  add,
}: {
  isOpen: boolean;
  memberData: MemberType | undefined;
  setMemberData: React.Dispatch<SetStateAction<MemberType | undefined>>;
  onSubmit: () => void;
  onClose: () => void;
  add: boolean;
}) => {
  const handleRoleChange = (event: any) => {
    const selectedRole = event.value;
    setMemberData((prevState) => ({
      ...prevState!,
      role: selectedRole,
    }));
  };

  function getOptionsForUserRole(): { value: Roles; label: Roles }[] {
    const userRole = getLoggedInUserOrganizationRole() as Roles;
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
    <Modal isOpen={isOpen} onClose={onClose} title={add ? 'Add Member' : 'Edit Member'}>
      <div className={styles.userInfoModalContainer}>
        <InputField
          type='text'
          name='Email'
          id='email'
          title='Enter Email'
          icon={<></>}
          required={false}
          onChange={(event) => {
            setMemberData((prevState) => ({
              ...prevState!,
              email: event.target.value,
            }));
          }}
          value={memberData?.email}
          placeholder='Enter the email address for the Member'
          disabled={memberData && memberData.id ? true : false}
        />

        <div className={styles.dropdown} style={{ width: '100%' }}>
          <p className={styles.inputLabel}>Select Role</p>
          <Select
            className='basic-single'
            classNamePrefix='select'
            value={roleOptions.filter((role) => role.value === memberData?.role)[0]}
            onChange={(event) => {
              handleRoleChange(event);
            }}
            name='role'
            options={getOptionsForUserRole()}
            styles={customStyles}
          />
        </div>

        <div className={styles.buttons}>
          <button className={`pointer ${styles.primaryButton}`} onClick={onSubmit}>
            {memberData && memberData.id ? 'Edit Member' : 'Add Member'}
          </button>
          <button className={`pointer ${styles.secondaryButton}`} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditMember;
