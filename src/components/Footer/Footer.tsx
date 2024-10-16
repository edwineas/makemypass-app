import { FaTelegramPlane } from 'react-icons/fa';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <>
      <footer>
        <div className={styles.footerContainer}>
          <hr />
          <div
            style={{
              justifyContent: 'space-between',
            }}
            className={styles.row}
          >
            <a href='https://www.theparentcompany.xyz/' target='_blank' rel='noopener noreferrer'>
              <img
                className={styles.hoomansLogo}
                src='/app/hoomans.webp'
                alt='the hoomans project logo'
              />
            </a>
            <div className={styles.socialIcons}>
              <a
                href='https://www.instagram.com/makemypass/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram color='a4a4a4' size={20} />
              </a>
              <a href='https://x.com/makemypass_x' target='_blank' rel='noopener noreferrer'>
                <FaXTwitter color='a4a4a4' size={20} />
              </a>
              <a href='https://t.me/makemypass' target='_blank' rel='noopener noreferrer'>
                <FaTelegramPlane color='a4a4a4' size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
