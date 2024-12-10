import DatePicker from 'react-datepicker';

import { TicketType } from '../../../../../../../../apis/types';
import styles from './SelectMultipleDates.module.css';

interface SelectDateProps {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  title?: string;
}

const SelectMultipleDates = ({ selectedTicket, setSelectedTicket, title }: SelectDateProps) => {
  return (
    <>
      {' '}
      <div className={styles.selectDateContainerAddGuest}>
        {
          <>
            <label className={styles.formLabel}>{title}</label>
            <div className={styles.selectionContainer}>
              <DatePicker
                wrapperClassName={styles.datePicker}
                selectedDates={selectedTicket.allowed_dates.map((date) => new Date(date)) || []}
                onChange={(dates) => {
                  setSelectedTicket({
                    ...selectedTicket,
                    allowed_dates: dates?.map((date) => {
                      const offset = date.getTimezoneOffset();
                      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
                      return adjustedDate.toISOString().split('T')[0];
                    }),
                  } as TicketType);
                }}
                dateFormat={'yyyy-MM-dd'}
                selectsMultiple={true}
                shouldCloseOnSelect={false}
                disabledKeyboardNavigation
              />
            </div>
          </>
        }
      </div>
    </>
  );
};

export default SelectMultipleDates;
