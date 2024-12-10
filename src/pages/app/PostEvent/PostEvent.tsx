import { useEffect, useState } from 'react';
import { LuMailPlus, LuMailX } from 'react-icons/lu';
import { TiTick } from 'react-icons/ti';
import { BeatLoader } from 'react-spinners';

import {
  getPostEventContentList,
  getPostEventStatus,
  sentPostEventMail,
  updatePostEventContent,
} from '../../../apis/postevent';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Modal from '../../../components/Modal/Modal';
import SectionButton from '../../../components/SectionButton/SectionButton';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField';
import UploadAttachement from '../EventGlance/components/MailModals/UpdateMail/components/UploadAttachement/UploadAttachements';
import styles from './PostEvent.module.css';

const PostEvent = () => {
  const [openConfirmModal, setConfirmModal] = useState({
    confirm: false,
    value: false,
  });

  const [postEventStatus, setPostEventStatus] = useState<PostEventStatus>();
  const [postEventContent, setPostEventContent] = useState<PostEventContent>({
    more_photo_link: null,
    photos: [],
    video_link: null,
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    getPostEventStatus(setPostEventStatus);
    getPostEventContentList(setPostEventContent);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setPostEventContent((prevContent) => ({
        ...prevContent,
        photos: [...prevContent.photos, ...newFiles],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setPostEventContent((prevContent) => ({
      ...prevContent,
      photos: prevContent.photos.filter((_, i) => i !== index),
    }));
  };

  const imgPreviews = postEventContent.photos.map((photo, index) => {
    if (photo instanceof File) {
      return {
        previewURL: URL.createObjectURL(photo),
        previewExtension: photo.type,
        previewName: photo.name,
      };
    } else {
      return {
        previewURL: photo,
        previewExtension: 'image/jpeg',
        previewName: `Image ${index + 1}`,
      };
    }
  });

  const handleSave = () => {
    setIsUploading(true);
    const formData = new FormData();
    const photosList: (File | string)[] = [];
    postEventContent.photos.forEach((photo) => {
      if (photo instanceof File) {
        photosList.push(photo);
      } else {
        photosList.push(photo); // Add existing URLs to the list
      }
    });
    photosList.forEach((photo) => {
      formData.append('photos[]', photo);
    });
    formData.append('video_link', postEventContent.video_link || '');
    formData.append('more_photo_link', postEventContent.more_photo_link || '');
    updatePostEventContent(formData, setIsUploading);
  };

  return (
    <>
      <Modal isOpen={openConfirmModal && openConfirmModal.confirm}>
        <p className={styles.modalHeader}>Send Mail</p>
        <p className={styles.modalSubText}>
          {(openConfirmModal.value && postEventStatus?.AfterEventThankYou) ||
          (!openConfirmModal.value && postEventStatus?.AfterEventSorry)
            ? `Are You Sure you want to send the mails to the ${postEventStatus?.AfterEventThankYou ? 'Participants' : 'Non-Participants'} again?`
            : 'Are you sure you want to send mails?'}
        </p>
        <div className={styles.buttons}>
          <p
            onClick={() => {
              sentPostEventMail(openConfirmModal.value).then(() => {
                setPostEventStatus(
                  (prevStatus) =>
                    ({
                      ...prevStatus,
                      ...(openConfirmModal.value
                        ? { AfterEventThankYou: true }
                        : { AfterEventSorry: true }),
                    }) as PostEventStatus,
                );
              });
              setTimeout(() => {
                setConfirmModal({ confirm: false, value: false });
              }, 1000);
            }}
            className={`pointer ${styles.button}`}
          >
            Send Mails
          </p>
          <p
            onClick={() => {
              setConfirmModal({ confirm: false, value: false });
            }}
            className={`pointer ${styles.button}`}
          >
            Cancel
          </p>
        </div>
      </Modal>

      <Theme>
        <DashboardLayout prevPage='-1' tabName='postevent'>
          <p className={styles.text}>Post-Event Mails</p>
          <p className={styles.subText}>
            Send mails to the participants and non-participants of the event
          </p>
          <div className={styles.postEventContainer}>
            <div className={styles.sbutton}>
              <SectionButton
                buttonText={`Participant`}
                onClick={() => {
                  setConfirmModal({ confirm: true, value: true });
                }}
                iconBefore={
                  postEventStatus?.AfterEventThankYou ? <TiTick size={28} color='' /> : <></>
                }
                icon={<LuMailPlus size={28} color='#7662FC' />}
              />
            </div>
            <div className={styles.sbutton}>
              <SectionButton
                buttonText='Non Participant'
                onClick={() => {
                  setConfirmModal({ confirm: true, value: false });
                }}
                iconBefore={
                  postEventStatus?.AfterEventSorry ? <TiTick size={28} color='' /> : <></>
                }
                icon={<LuMailX size={28} color='#C33D7B' />}
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <div>
              <p className={styles.text}>Upload images(Form)</p>
              <p className={styles.subText}>The below images will shown in the form as a gallery</p>
            </div>

            <UploadAttachement
              previews={imgPreviews}
              handleFileChange={handleImageChange}
              handleDeleteAttachment={handleRemoveImage}
              allowedFileTypes={['image/*']}
            />

            <InputField
              type='text'
              name='video'
              id='video'
              placeholder='https://www.youtube.com/watch?v=...'
              title='Enter Video Link'
              icon={<></>}
              value={postEventContent.video_link || ''}
              onChange={(event) =>
                setPostEventContent((prev) => ({
                  ...prev,
                  video_link: event.target.value,
                }))
              }
            />

            <InputField
              type='text'
              name='driveLink'
              placeholder='https://drive.google.com/...'
              id='driveLink'
              title='Enter Drive Link'
              icon={<></>}
              value={postEventContent.more_photo_link || ''}
              onChange={(event) =>
                setPostEventContent((prev) => ({
                  ...prev,
                  more_photo_link: event.target.value,
                }))
              }
            />
            <button className={styles.saveButton} onClick={handleSave}>
              {isUploading ? <BeatLoader color='#1d1d1d' size={10} /> : 'Save'}
            </button>
          </div>
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default PostEvent;
