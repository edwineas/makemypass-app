import { useEffect, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { HashLoader } from 'react-spinners';

import { getEventIndividualMailLog, getEventMailLog } from '../../../apis/logs';
import { formatDate } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Theme from '../../../components/Theme/Theme';
import type { EmailType } from '../Guests/components/ViewGuest/types';
import { PaginationDataType } from '../Guests/types';
import styles from './EventLogs.module.css';

const EventLogs = () => {
  const [mailLogs, setMailLogs] = useState<EmailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [selectedMailLog, setSelectedMailLog] = useState<{
    id: string;
    body: string;
  }>({
    id: '',
    body: '',
  });
  const eventId = JSON.parse(sessionStorage.getItem('eventData') || '{}').event_id;

  const [paginationData, setPaginationData] = useState<PaginationDataType>({
    page: 1,
    total_pages: 0,
    total_items: 0,
    per_page: 30,
    next: null,
    previous: null,
    fetchingData: false,
  });

  useEffect(() => {
    getEventMailLog(eventId, setMailLogs, setIsLoading, paginationData, setPaginationData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerFetch]);

  useEffect(() => {
    if (selectedMailLog && selectedMailLog.body === '') {
      getEventIndividualMailLog(eventId, selectedMailLog, setSelectedMailLog);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMailLog]);

  return (
    <>
      <Theme>
        <DashboardLayout prevPage='/events' tabName='logs'>
          {!isLoading ? (
            <>
              <p className={styles.mailLogsHeaders}>
                {mailLogs.length === 0 ? 'No logs available' : 'Event Mail Logs'}
              </p>
              <p className={styles.mailLogsSubText}>
                {mailLogs.length === 0
                  ? 'No mail logs available for this event'
                  : 'Click on the mail to view the content'}
              </p>
              <div className={styles.mailsContainer}>
                {mailLogs.map((mail, index) => (
                  <div
                    className={styles.mail}
                    key={index}
                    onClick={() => {
                      setSelectedMailLog({
                        id: mail.id,
                        body: '',
                      });
                    }}
                  >
                    <div className={styles.expandIcon}>
                      {
                        <BiChevronDown
                          size={25}
                          style={{
                            transform:
                              mail.id == selectedMailLog.id && selectedMailLog.body.length > 0
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                          }}
                        />
                      }
                    </div>

                    <div className={styles.mailHeader}>
                      <div className={styles.mailHeaderContents}>
                        <p className={styles.mailType}>
                          {mail.type} Mail @ {formatDate(mail.created_at, true)}
                        </p>

                        {mail.opened_at && (
                          <p className={styles.mailType}>
                            Mail Opened @ {formatDate(mail.opened_at, true)}
                          </p>
                        )}
                        <p className={styles.mailSubject}>{mail.subject}</p>

                        <p className={styles.mailDescription}>
                          To: <span>{mail.send_to}</span> <br />
                        </p>
                      </div>
                    </div>
                    {mail.id == selectedMailLog.id && selectedMailLog.body.length > 0 && (
                      <>
                        <hr className={styles.line} />
                        <div className={styles.mailContent}>
                          <pre> {selectedMailLog.body}</pre>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.paginationContainer}>
                {paginationData && (
                  <>
                    <div className={styles.totalRecords}>
                      <p className={styles.paginationText}>{paginationData.total_items} Records</p>
                    </div>
                    <div className={styles.perPage}>
                      <p className={styles.paginationText}>
                        Per Page:{' '}
                        <select
                          className={styles.perPageSelect}
                          value={paginationData.per_page}
                          onChange={(e) => {
                            setTriggerFetch && setTriggerFetch((prevState) => !prevState);
                            setPaginationData &&
                              setPaginationData((prevState) => ({
                                ...prevState,
                                per_page: Number(e.target.value),
                              }));
                          }}
                        >
                          <option value={30}>30</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </p>
                    </div>
                    {(paginationData.next || paginationData.previous) && (
                      <div className={styles.pagination}>
                        <p className={styles.paginationText}>
                          {paginationData.page} of {paginationData.total_pages}
                        </p>
                        <button
                          className={styles.paginationButton}
                          disabled={paginationData.page === 1}
                          onClick={() => {
                            setTriggerFetch && setTriggerFetch((prevState) => !prevState);
                            setPaginationData &&
                              setPaginationData((prevState) => ({
                                ...prevState,
                                page: prevState.page - 1,
                              }));
                          }}
                          style={
                            paginationData.previous === null
                              ? {
                                  opacity: 0.4,
                                  cursor: 'not-allowed',
                                }
                              : {}
                          }
                        >
                          {'<'}
                        </button>

                        <button
                          className={styles.paginationButton}
                          disabled={paginationData.page === paginationData.total_pages}
                          onClick={() => {
                            setTriggerFetch && setTriggerFetch((prevState) => !prevState);
                            setPaginationData &&
                              setPaginationData((prevState) => ({
                                ...prevState,
                                page: prevState.page + 1,
                              }));
                          }}
                          style={
                            paginationData.next === null
                              ? {
                                  opacity: 0.4,
                                  cursor: 'not-allowed',
                                }
                              : {}
                          }
                        >
                          {'>'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className='center'>
              <HashLoader color={'#46BF75'} size={50} />
            </div>
          )}
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default EventLogs;
