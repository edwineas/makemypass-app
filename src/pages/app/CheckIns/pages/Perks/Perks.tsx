import { useEffect, useState } from 'react';
import { GiPartyPopper } from 'react-icons/gi';

import { claimUserPerk, getScanPerkList } from '../../../../../apis/perks';
import { formatDate } from '../../../../../common/commonFunctions';
import EventHeader from '../../../../../components/EventHeader/EventHeader';
import Modal from '../../../../../components/Modal/Modal';
import Scanner from '../../../../../components/Scanner/Scanner';
import Theme from '../../../../../components/Theme/Theme';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import ScanLogs from '../../components/ScanLogs/ScanLogs';
import { LogType } from '../Venue/Venue';
import styles from './Perks.module.css';
import { ClaimPerkModalType, TicketPerkType } from './types';

const Perks = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);

  const [availablePerks, setAvailablePerks] = useState<TicketPerkType[]>([]);
  const [selectedPerk, setSelectedPerk] = useState<{
    id: string;
    name: string;
  }>({
    id: '',
    name: '',
  });
  const [ticketId, setTicketId] = useState<string>('');
  const [trigger, setTrigger] = useState(false);
  const [claimPerkModal, setClaimPerkModal] = useState<ClaimPerkModalType>();
  const [claimPerkSuccessModal, setClaimPerkSuccessModal] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<LogType[]>([]);
  const [exhaustHistory, setExhaustHistory] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  useEffect(() => {
    getScanPerkList(eventId, setAvailablePerks);
  }, [eventId]);

  useEffect(() => {
    if (ticketId.length > 0 && trigger) {
      claimUserPerk(
        eventId,
        ticketId,
        selectedPerk.id,
        setScanLogs,
        setChecking,
        setTrigger,
        setExhaustHistory,
        setClaimPerkSuccessModal,
        setClaimPerkModal,
        confirmation,
        setConfirmation,
        setTicketId,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, eventId]);

  return (
    <>
      <Theme>
        <Modal
          isOpen={exhaustHistory.length > 0}
          title='Previous Claims'
          onClose={() => setExhaustHistory([])}
        >
          <div className={styles.exhaustHistoryContainer}>
            <p className={styles.modalHeading}>Perk {selectedPerk.name}</p>
            <p className={styles.modalDescription}>You have already claimed the this perk at</p>
            {exhaustHistory.map((history, index) => (
              <div key={history} className={styles.exhaustHistoryItem}>
                <p
                  className={styles.exhaustHistoryItemDate}
                >{`${index + 1}. ${formatDate(history, true)}`}</p>
              </div>
            ))}
          </div>
        </Modal>

        <Modal
          isOpen={claimPerkSuccessModal}
          title='Success'
          onClose={() => setClaimPerkSuccessModal(false)}
        >
          <div className={styles.modalContainer}>
            <p className={styles.modalHeading}>
              Perk Claimed <GiPartyPopper />{' '}
            </p>
            <p className={styles.modalDescription}>You have successfully claimed the perk</p>
          </div>
        </Modal>

        <Modal
          title='Confirm Perk Claim'
          isOpen={claimPerkModal?.open || false}
          onClose={() => {
            setClaimPerkModal((prev) => (prev ? { ...prev, open: false } : undefined));
          }}
        >
          <div className={styles.modalContainer}>
            {claimPerkModal?.user_data && (
              <>
                {claimPerkModal.user_data.map((field, index) => (
                  <div key={index} className={styles.userDataField}>
                    <label className={styles.userDataLabel}>{field.title}:</label>
                    <label className={styles.userDataInput}>{field.value}</label>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className={styles.modalButtons}>
            <SecondaryButton
              style={{ backgroundColor: 'white', color: 'black', fontWeight: 500 }}
              buttonText='Confirm Claim'
              onClick={() => {
                setConfirmation(true);
                setClaimPerkModal((prev) => (prev ? { ...prev, open: false } : undefined));
                setTrigger(true);
              }}
            />
            <SecondaryButton
              buttonText='Cancel'
              onClick={() => {
                setClaimPerkModal((prev) => (prev ? { ...prev, open: false } : undefined));
              }}
            />
          </div>
        </Modal>

        <EventHeader previousPageNavigate='-1' />

        {!selectedPerk.id && (
          <div className={styles.perkClaimContainer}>
            <div className={styles.perkClaimBody}>
              {availablePerks.map(
                (perk) =>
                  perk.perks.length > 0 && (
                    <div key={perk.ticket_id} className={styles.perkClaimItem}>
                      <h2 className={styles.perkClaimItemHeading}>{perk.ticket_name}</h2>
                      <div className={styles.perkClaimItemContent}>
                        {perk.perks.map((perkItem) => (
                          <div key={perkItem.id} className={styles.perkClaimItemContentItem}>
                            <div className='row'>
                              <p className={styles.perkClaimItemContentItemName}>{perkItem.name}</p>
                              <p className={styles.perkClaimItemContentItemCount}>
                                {perkItem.count}/Ticket
                              </p>
                            </div>
                            <SecondaryButton
                              buttonText='Claim'
                              onClick={() => {
                                setSelectedPerk({
                                  id: perkItem.id,
                                  name: perkItem.name,
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}

        {selectedPerk.id && (
          <div className={styles.scannerContainer}>
            <div className={styles.pageTexts}>
              <p className={styles.pageHeading}>Selected Perk: {selectedPerk.name}</p>
            </div>

            <Scanner
              ticketId={ticketId}
              setTicketId={setTicketId}
              trigger={trigger}
              setTrigger={setTrigger}
              checking={checking}
              onClose={() => {
                setSelectedPerk({
                  id: '',
                  name: '',
                });
              }}
            />

            <ScanLogs scanLogs={scanLogs} />
          </div>
        )}
      </Theme>
    </>
  );
};

export default Perks;
