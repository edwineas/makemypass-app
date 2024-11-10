import { TicketType } from '../../../../../../../apis/types';
import { isUserEditor } from '../../../../../../../common/commonFunctions';
import Slider from '../../../../../../../components/SliderButton/Slider';
import styles from './TicketBox.module.css';

type Props = {
  ticketInfo: TicketType;
  onClick: () => void;
  selected: boolean;
  closed: boolean;
  handleDefaultSelected: (ticketId: string) => void;
  hasUnsavedChanges: () => boolean;
  handleTicketClick: (ticketId: string) => void;
};

const TicketBox = ({
  ticketInfo,
  onClick,
  selected,
  closed,
  handleDefaultSelected,
  hasUnsavedChanges,
  handleTicketClick,
}: Props) => {
  return (
    <>
      <div className={`${styles.ticketBox} ${selected ? styles.selected : ''}`} onClick={onClick}>
        <div className={styles.ticket} onClick={() => handleTicketClick(ticketInfo?.id)}>
          <img
            className={styles.ticketImage}
            src={
              ticketInfo?.image?.file_path
                ? ticketInfo.image.file_path
                : 'https://cdn.evbuc.com/images/125743787/209728027112/1/original.20210818-181041'
            }
            alt='ticket'
            height={'100%'}
            // width={'100%'}
          />
        </div>
        <div className={styles.ticketInfo}>
          <p className={styles.ticketName}>{ticketInfo.title}</p>
          <p className={styles.ticketType}>
            {ticketInfo.registration_count}
            {ticketInfo.capacity != null ? '/' + ticketInfo.capacity : ''} <br />
            Registered
          </p>
        </div>
        <div className={styles.ticketFooter}>
          <div className={styles.ticketFooterLeft}>
            {' '}
            <span
              className={
                styles.availableDot +
                ' ' +
                ((closed ||
                  (ticketInfo?.capacity != null &&
                    ticketInfo?.registration_count >= ticketInfo?.capacity)) &&
                  styles.unavailable)
              }
            ></span>
            {(closed ||
              (ticketInfo?.capacity != null &&
                ticketInfo?.registration_count >= ticketInfo?.capacity)) &&
              'Not '}
            Available
          </div>
          <div className={styles.ticketFooterRight}>
            <label className={styles.closeTicketLabel}>Default Selected</label>
            <Slider
              checked={ticketInfo.default_selected}
              onChange={() => {
                if (isUserEditor() && !hasUnsavedChanges()) handleDefaultSelected(ticketInfo?.id);
              }}
              sliderStyle={{ transform: 'scale(0.7)' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketBox;
