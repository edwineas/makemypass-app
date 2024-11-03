import { useEffect, useMemo, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { LuPencil } from 'react-icons/lu';
import { useLocation } from 'react-router';
import { BeatLoader } from 'react-spinners';

import { updateOrg } from '../../../../apis/orgs';
import { isUserEditor } from '../../../../common/commonFunctions';
import Theme from '../../../../components/Theme/Theme';
import InputField from '../../../auth/Login/InputField';
import styles from './EditOrganization.module.css';
import type { OrganizationType } from './types';

const EditOrganization = () => {
  const location = useLocation();
  console.log(location.state);

  const organization = useMemo(() => location.state || {}, [location.state]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [organizationState, setOrganizationState] = useState<OrganizationType>({
    id: '',
    banner: null,
    description: '',
    logo: null,
    name: '',
    title: '',
  });

  useEffect(() => {
    if (organization) {
      setOrganizationState({
        id: organization.id,
        banner: null,
        description: organization.description,
        logo: null,
        name: organization.name,
        title: organization.title,
      });
    }
  }, [organization]);

  const updateOrganization = () => {
    updateOrg(organization?.id, organizationState, setIsUpdating);
  };

  return (
    <Theme>
      <div className={styles.editOrganizationContainer}>
        <InputField
          title='Organization Name'
          description='This will be shown thoughout the platform.'
          icon={<LuPencil size={15} color='#949597' />}
          id='organizationName'
          name='organizationName'
          type='text'
          value={organizationState.name}
          placeholder='Organization Name'
          disabled={!isUserEditor()}
          onChange={(e) => setOrganizationState({ ...organizationState, name: e.target.value })}
        />
        <InputField
          title='Organization Title'
          description='This will be used in the url.'
          icon={<LuPencil size={15} color='#949597' />}
          id='organizationTitle'
          name='organizationTitle'
          type='text'
          value={organizationState.title}
          placeholder='Organization Title'
          disabled={!isUserEditor()}
          onChange={(e) => setOrganizationState({ ...organizationState, title: e.target.value })}
          style={{ marginTop: '0' }}
        />

        <InputField
          title='Description'
          description='This will be shown thoughout the platform.'
          icon={<LuPencil size={15} color='#949597' />}
          id='description'
          name='description'
          type='text'
          value={organizationState.description || ''}
          placeholder='Description'
          disabled={!isUserEditor()}
          onChange={(e) =>
            setOrganizationState({ ...organizationState, description: e.target.value })
          }
          style={{ marginTop: '0' }}
        />

        <div className={styles.uploadLogoContainerParent}>
          <div
            className='row'
            style={{
              flexWrap: 'nowrap',
            }}
          >
            <div className={styles.uploadLogoContainer}>
              <div>
                {organizationState.logo ? (
                  <img
                    src={
                      organizationState.logo instanceof Blob
                        ? URL.createObjectURL(organizationState.logo)
                        : organizationState.logo
                    }
                    alt='Uploaded Image'
                    className={styles.noImage}
                  />
                ) : organization?.logo && typeof organization?.logo === 'string' ? (
                  <img src={organization.logo} className={styles.noImage} />
                ) : (
                  <div className={styles.noImage}></div>
                )}
              </div>
              <div className={styles.uploadLogo}>
                <p>Upload {organization?.logo ? 'New' : ''} Logo</p>
                <p className={styles.logoName}>
                  {organizationState.logo instanceof Blob
                    ? (organizationState.logo as File).name
                    : ''}
                </p>
              </div>
              <input
                disabled={!isUserEditor()}
                type='file'
                className={styles.fileUpload}
                accept='image/*'
                onChange={(e) =>
                  isUserEditor() &&
                  setOrganizationState({
                    ...organizationState,
                    logo: e.target.files ? e.target.files[0] : null,
                  })
                }
              />
              <div className={styles.pencil}>
                <LuPencil size={15} color='#949597' />
              </div>
            </div>
            <IoCloseOutline
              className={styles.uploadCloseIcon}
              color='#949597'
              onClick={() => {
                if (isUserEditor()) {
                  setOrganizationState({ ...organizationState, logo: null });
                }
              }}
              style={
                !organizationState.logo && !organization?.logo
                  ? { display: 'none' }
                  : { display: 'block' }
              }
            />
          </div>
        </div>
        <div className={styles.bannerContainer}>
          <input
            type='file'
            className={styles.fileUpload}
            disabled={!isUserEditor()}
            accept='image/*'
            onChange={(e) =>
              isUserEditor() &&
              setOrganizationState({
                ...organizationState,
                banner: e.target.files ? e.target.files[0] : null,
              })
            }
          />
          {organization?.banner ? (
            <>
              <IoCloseOutline
                className={styles.closeIcon}
                color='#949597'
                onClick={() => {
                  isUserEditor() && setOrganizationState({ ...organizationState, banner: null });
                }}
              />
              {organization?.banner && typeof organization?.banner === 'string' && (
                <img src={organization?.banner} alt='' className={styles.banner} />
              )}
            </>
          ) : (
            <>
              {organizationState.banner ? (
                <>
                  <IoCloseOutline
                    className={styles.closeIcon}
                    color='#949597'
                    onClick={() => {
                      isUserEditor() &&
                        organization?.banner &&
                        setOrganizationState({ ...organizationState, banner: null });
                      setOrganizationState({ ...organizationState, banner: null });
                    }}
                  />
                  <img
                    src={
                      organizationState.banner instanceof Blob
                        ? URL.createObjectURL(organizationState.banner)
                        : organizationState.banner
                    }
                    alt=''
                    className={styles.banner}
                  />
                </>
              ) : (
                <svg height='250' width='100%' className={styles.banner}>
                  <>
                    <rect width='100%' height='100%' className={styles.banner} />
                    <text x='12%' y='50%' fill='white' className={styles.svgText}>
                      No Banner. Click Here to Upload (2000px x 1000px)
                    </text>
                  </>
                </svg>
              )}
            </>
          )}
        </div>

        <div className={styles.buttonsContainer}>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveButton} onClick={updateOrganization}>
            {isUpdating ? <BeatLoader color='#272727' size={10} /> : 'Save'}
          </button>
        </div>
      </div>
    </Theme>
  );
};

export default EditOrganization;
