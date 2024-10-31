import React from 'react';

import { TicketType } from '../../../../../../../apis/types';
import Modal from '../../../../../../../components/Modal/Modal';
import styles from './UnsavedChanges.module.css';

type Props = {
  setIsChangedModal: React.Dispatch<React.SetStateAction<boolean>>;
  ticketData: TicketType[];
  ticketPair: TicketType[] | undefined;
  setIsTicketsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  wantToClose: boolean;
  setWantToClose: React.Dispatch<React.SetStateAction<boolean>>;
  updateTicket: (ticket?: TicketType) => Promise<void>;
};

const UnsavedChanges = ({
  setIsChangedModal,
  ticketData,
  ticketPair,
  setIsTicketsOpen,
  setSelectedTicket,
  wantToClose,
  setWantToClose,
  updateTicket,
}: Props) => {
  return (
    <>
      <Modal onClose={() => setIsChangedModal(false)} title='Unsaved Changes' zIndexCount={101}>
        <div className={styles.sectionContent1}>
          <p className={styles.sectionTitle}>You have unsaved changes</p>
          <p className={styles.sectionSubTitle}>
            Are you sure you want to continue without saving?
          </p>
        </div>
        <div className={styles.modalButtons}>
          <button
            className={styles.confirmButton}
            onClick={() => {
              setIsChangedModal(false);
              const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
              (tempTicket.id != tempSelectedTicket?.id || wantToClose) &&
                updateTicket(tempSelectedTicket as TicketType).then(() => {
                  setSelectedTicket(
                    Object.assign(
                      {},
                      ticketData.find((t) => t.id == tempTicket.id),
                    ),
                  );
                });
              if (wantToClose) {
                setIsTicketsOpen(false);
                setWantToClose(false);
                return;
              }
            }}
          >
            Save changes and continue
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => {
              setIsChangedModal(false);
              if (wantToClose) {
                setIsTicketsOpen(false);
                setWantToClose(false);
                return;
              }

              const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
              tempTicket.id != tempSelectedTicket?.id &&
                setSelectedTicket(
                  Object.assign(
                    {},
                    ticketData.find((t) => t.id == tempTicket.id),
                  ),
                );
            }}
          >
            Continue Without Saving
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UnsavedChanges;
