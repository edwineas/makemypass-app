import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';

import ManageTicketHeader from '../../pages/app/EventGlance/components/ManageTickets/components/ManageTicketHeader/ManageTicketHeader';
import styles from './Modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  isOpen: boolean;
  onClose?: () => void;
  type?: string;
  title?: string;
  zIndexCount?: number;
};

const Modal = ({
  children,
  onClose,
  isOpen,
  style,
  type,
  title,
  zIndexCount,
  ...inputProps
}: ModalProps) => {
  return ReactDOM.createPortal(
    type && type == 'side' ? (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              onClick={onClose}
              className={styles.backgroundBlur}
              style={{
                zIndex: zIndexCount,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
            <motion.dialog
              {...inputProps}
              className={styles.sideModal}
              initial={{ x: '100%', opacity: 0, translateY: '-50%' }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              exit={{ x: '100%', opacity: 0 }}
            >
              <ManageTicketHeader title={title} onClose={onClose} />
              {children}
            </motion.dialog>
          </>
        )}
      </AnimatePresence>
    ) : (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              onClick={onClose}
              className={styles.backgroundBlur}
              style={{
                zIndex: zIndexCount,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
            <motion.dialog
              {...inputProps}
              className={styles.onClickModal}
              style={style}
              initial={{ scale: 0.5, opacity: 0, translateY: '-50%' }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              exit={{ scale: 0.3, opacity: 0 }}
            >
              {title && (
                <div className={styles.modalHeader}>
                  <p className={styles.modalHeaderText}>{title}</p>
                  <button onClick={onClose} className={styles.closeButton}>
                    X
                  </button>
                </div>
              )}
              {children}
            </motion.dialog>
          </>
        )}
      </AnimatePresence>
    ),
    document.getElementById('root') as Element,
  );
};

export default Modal;
