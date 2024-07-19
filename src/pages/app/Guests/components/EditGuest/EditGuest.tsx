import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DynamicForm from '../../../../../components/DynamicForm/DynamicForm';
import Modal from '../../../../../components/Modal/Modal';
import styles from '../../Guests.module.css';
import { editSubmissons, getEditGuestData } from '../../../../../apis/guests';
import { FormEventData, SelectedGuest } from '../../types';
import { FormDataType } from '../../../../../apis/types';

const EditGuest = ({
  formData,
  setFormData,
  eventFormData,
  setSelectedGuestId,
  eventId,
  onClose,
}: {
  formData: any;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  eventFormData: FormEventData;

  selectedGuestId: SelectedGuest;
  setSelectedGuestId: Dispatch<React.SetStateAction<SelectedGuest | null>>;
  eventId: string;
  onClose: () => void;
}) => {
  const [formErrors, setFormErrors] = useState<any>({});

  const onFieldChange = (fieldName: string, fieldValue: string | string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: fieldValue,
    }));

    if (formErrors[fieldName]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: '',
      });
    }
  };

  const handleSubmissionEdit = () => {
    editSubmissons(eventId, formData, setSelectedGuestId, setFormData, setFormErrors);
  };

  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);

  return (
    <Modal title='Edit Guest' onClose={onClose} type='side'>
      <div className={styles.userInfoModalContainer}>
        {formData && eventFormData && (
          <>
            <div className={styles.formFields}>
              <DynamicForm
                formFields={eventFormData.form}
                formErrors={formErrors}
                formData={formData}
                onFieldChange={onFieldChange}
              />
            </div>
            <div className={styles.buttons}>
              <p
                onClick={() => {
                  handleSubmissionEdit();
                }}
                className={`pointer ${styles.button}`}
              >
                Edit
              </p>
              <p
                onClick={() => {
                  setSelectedGuestId({
                    id: '',
                    type: '',
                  });
                }}
                className={`pointer ${styles.button}`}
              >
                Cancel
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EditGuest;
