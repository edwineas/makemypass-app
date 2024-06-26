/* eslint-disable react-hooks/exhaustive-deps */
import { IoMicOutline } from 'react-icons/io5';
import styles from './VoiceInput.module.css';
import { Dispatch, useEffect, useState } from 'react';
import { AudioControlsType } from '../../../types';
import { postAudio } from '../../../../../../apis/publicpage';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { FormEventData } from '../../../../Guests/types';
import { FormDataType } from '../../../../../../apis/types';

const VoiceInput = ({
  eventFormData,
  formData,
  setFormData,
}: {
  eventFormData: FormEventData;
  formData: FormDataType;
  setFormData: Dispatch<React.SetStateAction<FormDataType>>;
}) => {
  const handleAudioSubmit = (recordedBlob: Blob | null) => {
    if (recordedBlob && eventFormData.id && formData && setFormData) {
      postAudio(eventFormData.id, recordedBlob, formData, setFormData, setShowAudioModal);
    }
  };

  const [showAudioModal, setShowAudioModal] = useState<AudioControlsType>({
    showModal: false,
    transcribing: false,
    noData: false,
  });

  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error, audioRef } = recorderControls;

  const closeAudioModal = () => {
    setShowAudioModal({
      showModal: false,
      transcribing: false,
      noData: false,
    });
    recorderControls.stopRecording();
  };

  useEffect(() => {
    if (!error) return;
    toast.error('Audio input not detected');
  }, [error]);

  useEffect(() => {
    if (showAudioModal.noData) {
      recorderControls.clearCanvas();
    }
  }, [showAudioModal.noData]);

  useEffect(() => {
    recorderControls.startRecording();
    setShowAudioModal({
      ...showAudioModal,
      transcribing: false,
      noData: false,
    });
  }, []);

  useEffect(() => {
    if (recordedBlob && showAudioModal.showModal) {
      handleAudioSubmit(recordedBlob);
    }
  }, [recordedBlob]);

  return (
    <>
      {' '}
      {!(recorderControls.isRecordingInProgress || recorderControls.isAvailableRecordedAudio) ? (
        <button
          onClick={() => {
            recorderControls.startRecording();
            setShowAudioModal({
              ...showAudioModal,
              transcribing: false,
              noData: false,
            });
          }}
          className={styles.reocordUsingVoiceButton}
        >
          {showAudioModal.transcribing ? (
            <PropagateLoader
              color={'#fff'}
              loading={showAudioModal.transcribing}
              size={10}
              style={{
                padding: '0.75rem 1.5rem',
                paddingTop: '0.5rem',
              }}
            />
          ) : (
            <>
              <IoMicOutline
                size={18}
                style={{
                  marginRight: '0.5rem',
                }}
              />
              Record Voice to Fill <span>(Beta)</span>
            </>
          )}
        </button>
      ) : (
        <>
          <div className={styles.buttonsContainer}>
            <button className={styles.cancelButton} onClick={closeAudioModal}>
              Cancel
            </button>
            <div className={styles.durationContainer}>
              <p className={styles.duration}>{recorderControls.formattedRecordingTime}s</p>
              <div className={styles.vizualizer}>
                <VoiceVisualizer
                  ref={audioRef}
                  controls={recorderControls}
                  isControlPanelShown={false}
                  isDefaultUIShown={false}
                  height={'50'}
                  mainBarColor='#A0FFC8'
                  barWidth={3}
                  rounded={5}
                  speed={2}
                />
              </div>
            </div>
            <button
              className={styles.submitButton}
              onClick={() => {
                recorderControls.stopRecording();
                setShowAudioModal({
                  ...showAudioModal,
                  showModal: true,
                });
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
      <p className={styles.noDataAlert}>
        {showAudioModal.noData
          ? 'We found no field from your audio to fill in, Kindly record again.'
          : ''}
      </p>
      <div className={styles.orContainer}>
        <hr />
        <p>OR</p>
        <hr />
      </div>
    </>
  );
};

export default VoiceInput;
