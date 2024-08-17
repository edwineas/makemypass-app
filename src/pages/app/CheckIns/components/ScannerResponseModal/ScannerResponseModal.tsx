import Modal from '../../../../../components/Modal/Modal';
import styles from './ScannerResponseModal.module.css';
import React, { Dispatch } from 'react';
import { multipleTicketCount } from '../../pages/ScanQR/types';

const ScannerResponseModal = ({
  message,
  setMessage,
  setTicketId,
  setTrigger,
  setMultipleTickets,
  multipleTickets,
  type,
}: {
  message: string;
  setMessage: (message: string) => void;
  setTrigger: Dispatch<React.SetStateAction<boolean>>;
  setTicketId?: (ticketId: string) => void;
  setMultipleTickets?: Dispatch<React.SetStateAction<multipleTicketCount>>;
  multipleTickets?: multipleTicketCount;
  type?: string;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    message &&
    message.length > 0 && (
      <>
        <div className={styles.backgroundBlur}></div>
        <Modal
          title={multipleTickets && multipleTickets.hasMultipleTickets ? message : 'User Check-In'}
          onClose={() => {
            setMessage('');
            if (setTicketId) setTicketId('');
            setTrigger(false);
            if (setMultipleTickets)
              setMultipleTickets({
                hasMultipleTickets: false,
              });
          }}
        >
          {multipleTickets && !multipleTickets.hasMultipleTickets && (
            <>
              <p className={styles.modalSubText}>{message}</p>
              <button
                className={styles.modalButton}
                onClick={() => {
                  setMessage('');
                  if (setTicketId) setTicketId('');
                  setTrigger(false);
                  if (setMultipleTickets)
                    setMultipleTickets({
                      hasMultipleTickets: false,
                    });
                }}
              >
                Close
              </button>
            </>
          )}
          {multipleTickets && multipleTickets.hasMultipleTickets && (
            <>
              <div className={styles.multipleTicketsContainer}>
                <div className='row'>
                  {multipleTickets.userName && (
                    <p className={styles.userName}>
                      Name: <span className={styles.userValue}>{multipleTickets.userName}</span>
                    </p>
                  )}
                  {multipleTickets.entryDate && (
                    <p className={styles.userName}>
                      Entry Date:{' '}
                      <span className={styles.userValue}>{multipleTickets.entryDate}</span>
                    </p>
                  )}
                </div>
                <hr className={styles.line} />

                {multipleTickets.tickets?.map((ticket, index) => (
                  <div className={styles.input} key={index}>
                    <div className={styles.inputLabel}>
                      <p className={styles.labelHeader}>
                        <span className={styles.ticketName}>{ticket.ticket_name}</span>
                      </p>
                      <span className={styles.ticketCount}>
                        ({ticket.remaining_count}/{ticket.total_count} left){' '}
                      </span>
                    </div>
                    {ticket.remaining_count > 0 && (
                      <input
                        className={styles.inputField}
                        type='number'
                        min={0}
                        ref={inputRef}
                        value={ticket.checked_in_count}
                        placeholder='0'
                        onChange={(e) => {
                          const value = e.target.value;
                          if (setMultipleTickets) {
                            if (Number(value) > ticket.remaining_count)
                              e.target.value = ticket.remaining_count.toString();
                            if (Number(value) <= ticket.remaining_count)
                              setMultipleTickets((prevData) => ({
                                ...prevData,
                                tickets: prevData.tickets?.map((ticketData) => {
                                  if (ticketData.ticket_id === ticket.ticket_id) {
                                    return {
                                      ...ticketData,
                                      checked_in_count: Number(value),
                                    };
                                  }
                                  return ticketData;
                                }),
                              }));
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                className={styles.modalButton}
                onClick={() => {
                  setTrigger(true);
                }}
              >
                {type === 'checkIn' ? 'Check-In User' : 'Check-Out User'}
              </button>
            </>
          )}
        </Modal>
      </>
    )
  );
};

export default ScannerResponseModal;
