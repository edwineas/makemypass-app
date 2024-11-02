import { motion } from 'framer-motion';
import { useEffect } from 'react';

import styles from './Hero.module.css';

const Hero = () => {
  const images = ['/app/landing/landingimg.webp'];
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const boxShadowVariants = {
    hover: {
      boxShadow: '9.146px 7.622px 0px 0px #000',
      x: '5px',
      y: '5px',
    },
  };

  return (
    <div className={styles.firstSection}>
      <div
        className={styles.fsTexts}
        style={{
          width: '100%',
        }}
      >
        <p className={styles.fsHeading}>
          <span
            style={{ display: 'inline-block', transform: 'rotate(-2deg)', marginRight: '1rem' }}
          >
            Simplify
          </span>{' '}
          Event Planning,
          <span
            style={{ display: 'inline-block', transform: 'rotate(-2deg)', marginRight: '1rem' }}
          >
            Amplify
          </span>{' '}
          Event Experience
        </p>
        <p className={styles.fsSubHeading}>
          Why wrestle with Event Chaos when you can be smooth sailing into Event Clarity? With
          MakeMyPass, forget about paper – ‘cause your tickets are safe and sound in your phone!
        </p>
        <div className={styles.row}>
          <a href='https://wa.me/916238450178' target='_blank' rel='noopener noreferrer'>
            <motion.button
              className={styles.requestDemo}
              whileHover='hover'
              variants={boxShadowVariants}
              initial={false}
            >
              Talk to Us
            </motion.button>
          </a>

          <a
            className={styles.requestDemoText}
            href='http://cal.com/adnankattekaden/15min'
            target='_blank'
            rel='noopener noreferrer'
          >
            <p className={styles.scheduleDemo}>Schedule a Demo</p>
          </a>
        </div>
      </div>

      <img
        src='/app/landing/landing.png'
        alt='features of makemypass.com'
        className={styles.fsImage}
      />
    </div>
  );
};

export default Hero;
