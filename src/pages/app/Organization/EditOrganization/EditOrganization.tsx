import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiMail, FiPhone } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';
import { BeatLoader } from 'react-spinners';

import { updateOrg } from '../../../../apis/orgs';
import InputField from '../../../auth/Login/InputField';
import styles from './EditOrganization.module.css';
import type { OrganizationType } from './types';

const EditOrganization = ({
  organization,
  organizationState,
  setOrganizationState,
  setShowEditModal,
  setTriggerFetch,
  setShowCommunicationMediumModal,
}: {
  organization: OrganizationType;
  organizationState: OrganizationType;
  setOrganizationState: Dispatch<SetStateAction<OrganizationType>>;
  setShowEditModal: Dispatch<SetStateAction<boolean>>;
  setTriggerFetch: Dispatch<SetStateAction<boolean>>;
  setShowCommunicationMediumModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (organization) {
      setOrganizationState({
        id: organization.id,
        banner: organization.banner,
        description: organization.description,
        logo: organization.logo,
        name: organization.name,
        title: organization.title,
        socials: organization.socials,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const navigate = useNavigate();

  const updateOrganization = () => {
    updateOrg(
      organization,
      organizationState,
      setIsUpdating,
      navigate,
      setShowEditModal,
      setTriggerFetch,
    );
  };

  return (
    <div className={styles.editOrganizationContainer}>
      <InputField
        title='Organization Name'
        description='This will be shown thoughout the url.'
        icon={<LuPencil size={15} color='#949597' />}
        id='organizationName'
        name='organizationName'
        type='text'
        value={organizationState.name}
        placeholder='Organization Name'
        onChange={(e) => setOrganizationState({ ...organizationState, name: e.target.value })}
      />
      <InputField
        title='Organization Title'
        description='This will be used in the title.'
        icon={<LuPencil size={15} color='#949597' />}
        id='organizationTitle'
        name='organizationTitle'
        type='text'
        value={organizationState.title}
        placeholder='Organization Title'
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
              type='file'
              className={styles.fileUpload}
              accept='image/*'
              onChange={(e) =>
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
              setOrganizationState({ ...organizationState, logo: null });
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
          accept='image/*'
          onChange={(e) =>
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
                setOrganizationState({ ...organizationState, banner: null });
              }}
            />
            {organizationState?.banner && typeof organizationState?.banner === 'string' ? (
              <img src={organizationState?.banner} alt='' className={styles.banner} />
            ) : (
              organizationState?.banner &&
              organizationState.banner instanceof Blob && (
                <img
                  src={URL.createObjectURL(organizationState?.banner)}
                  alt=''
                  className={styles.banner}
                />
              )
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
                    Click Here to Upload (2000px x 1000px)
                  </text>
                </>
              </svg>
            )}
          </>
        )}
      </div>

      <div className={styles.socialMediaContainer}>
        <p className={styles.socialMediaContainerHeader}>Communication Mediums</p>
        <div className={styles.communcationMediumInnerContainer}>
          <div className={styles.communicationMediumIcons}>
            <a href='tel:+1234567890'>
              <FiPhone
                size={20}
                color={organizationState?.socials?.phone ? '#46BF75' : '#949597'}
              />
            </a>
            <a
              href={`https://wa.me/${organizationState?.socials?.whatsapp}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaWhatsapp
                size={20}
                color={organizationState?.socials?.whatsapp ? '#46BF75' : '#949597'}
              />
            </a>
            <a
              href={`mailto:${organizationState?.socials?.email}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FiMail size={20} color={organizationState?.socials?.email ? '#46BF75' : '#949597'} />
            </a>
            <a
              href={organizationState?.socials?.instagram}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaInstagram
                size={20}
                color={organizationState?.socials?.instagram ? '#46BF75' : '#949597'}
              />
            </a>
            <a
              href={organizationState?.socials?.facebook}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaFacebook
                size={20}
                color={organizationState?.socials?.facebook ? '#46BF75' : '#949597'}
              />
            </a>
            <a href={organizationState?.socials?.twitter} target='_blank' rel='noopener noreferrer'>
              <FaTwitter
                size={20}
                color={organizationState?.socials?.twitter ? '#46BF75' : '#949597'}
              />
            </a>
            <a
              href={organizationState?.socials?.linkedin}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaLinkedin
                size={20}
                color={organizationState?.socials?.linkedin ? '#46BF75' : '#949597'}
              />
            </a>
          </div>
          <LuPencil
            size={18}
            color='#949597'
            onClick={() => {
              setShowCommunicationMediumModal(true);
            }}
          />
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <button className={styles.cancelButton} onClick={() => setShowEditModal(false)}>
          Cancel
        </button>
        <button className={styles.saveButton} onClick={updateOrganization}>
          {isUpdating ? <BeatLoader color='#272727' size={10} /> : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditOrganization;
