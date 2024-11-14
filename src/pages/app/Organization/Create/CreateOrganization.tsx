import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

import { createOrg } from '../../../../apis/orgs';
import Theme from '../../../../components/Theme/Theme';
import InputField from '../../../auth/Login/InputField';
import styles from './CreateOrganization.module.css';

const CreateOrganization = () => {
  const [eventTitle, setEventTitle] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const submitCreateEvent = () => {
    if (eventTitle) {
      createOrg(eventTitle, userEmail, setIsCreating);
    }
  };

  return (
    <Theme>
      <div className={styles.createEventContainer}>
        <div className={styles.inputContainer}>
          <div className={styles.eventInput}>
            <InputField
              title='Organization Owner'
              type='email'
              name='email'
              description='This user will be the owner of the organization.'
              placeholder='Enter email'
              id='email'
              icon={''}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value.trim())}
            />
            <InputField
              title='Organization Name'
              type='text'
              placeholder='Enter organization name'
              name='name'
              description='The name of the organization.'
              id='name'
              icon={''}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value.trim())}
            />
          </div>

          <button
            className={styles.confirmButton}
            onClick={submitCreateEvent}
            disabled={!eventTitle || !userEmail || isCreating}
          >
            {isCreating ? <BeatLoader color='1d1d1d' size={8} /> : 'Create Organization'}
          </button>
        </div>
      </div>
    </Theme>
  );
};

export default CreateOrganization;
