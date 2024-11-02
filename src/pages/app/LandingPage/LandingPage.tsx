import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Theme from '../../../components/Theme/Theme';
import EventPartners from './components/EventPartners/EventPartners';
import Hero from './components/Hero/Hero';
import PricingSection from './components/PricingCards/PricingCards';
import TestimonialSection from './components/TestimonialSection/TestimonialSection';
// import WhyUs from './components/WhyUs/WhyUs';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('accessToken') && location.pathname === '/') {
      navigate('/events');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Theme type='landing'>
        <div className={styles.landingPageContainer}>
          <Hero />

          <EventPartners />

          <div className={styles.secondSection}>
            <div className={styles.fsTexts}>
              <p
                className={styles.didyouknow}
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                DID YOU KNOW?
              </p>
              <p className={styles.ssHeading}>
                You’re Wasting{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  Over 17 Hours
                </span>
                Per Event!
              </p>
            </div>
            <ul className={styles.timeWastedContainer}>
              <li>
                <span>+ 4 hrs</span> Sending emails to users at various points.
              </li>
              <li>
                <span>+ 3 hrs</span> Sending custom tickets to the participants.
              </li>
              <li>
                <span>+ 3 hrs</span> Generating event statistics from CSVs.
              </li>
              <li>
                <span>+ 2 hrs</span> Distribution of event materials to the attendees.
              </li>
              <li>
                <span>+ 3 hrs</span> Setting up attendee check-ins at the venue.
              </li>
              <li>
                <span>+ 2 hrs</span> Managing on-site attendance and ticket sales.
              </li>
            </ul>
          </div>

          <p className={styles.theEasyWay}>↓ Let's do it the easy way!</p>

          <div className={styles.thirdSection}>
            <div className={styles.tsTexts}>
              <p className={styles.tsHeading}>
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  Customize
                </span>
                Your Emails & <br />
                Tickets and Even
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  {' '}
                  Schedule It!
                </span>
              </p>
              <p className={styles.tsSubHeading}>
                Our landing page wasn’t vibing the way we wanted, and let’s be honest—communication
                is everything! We’ve given ourselves a makeover, so how about you? Keep it simple
                and go the easy route!
              </p>
              <p className={styles.theEasyWay}>
                To date, we’ve sent 154,563+ emails and issued over 51,345 tickets for our users!
              </p>
            </div>

            <img
              src='/app/landing/tickets.png'
              alt='features of makemypass.com'
              className={styles.tsImage}
              width={400}
            />
          </div>

          <div className={styles.thirdSection}>
            <a
              href='https://makemypass.com/override.py/public/insights'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img
                src='/app/landing/tsImg.webp'
                alt='features of makemypass.com'
                className={styles.frsImage}
                loading='lazy'
                width={400}
              />
            </a>
            <div className={styles.frsTexts}>
              <p className={styles.frHeading}>
                Ditch The Dull CSV’s! ‘Cause <br /> We’ve Got Stunning{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  Insights!
                </span>
              </p>
              <p className={styles.frSubHeading}>
                Imagine your data brought to life with vibrant graphics! Now picture all that in
                real-time. Sounds insightful, right? We’ve got that covered too!
              </p>
              <p className={styles.theEasyWay}>
                Curious? Give that image a quick tap for an ‘insightful’ surprise!
              </p>
            </div>
          </div>

          <div className={styles.thirdSection}>
            <div className={styles.tsTexts}>
              <p className={styles.tsHeading}>
                Ready, Set,{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  Check In!
                </span>
                With Just{' '}
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-2deg)',
                    marginRight: '1rem',
                  }}
                >
                  3 Clicks,
                </span>
                You’re Done!
              </p>
              <p className={styles.tsSubHeading}>
                Wave goodbye to long queues and say hello to effortless check-ins with MakeMyPass’s
                seamless 3- click formula!
              </p>
            </div>

            <img
              src='/app/landing/scanning.webp'
              alt='features of makemypass.com'
              className={styles.frsImage}
              loading='lazy'
              width={400}
            />
          </div>

          <div className={styles.tsTexts}>
            <p className={styles.tsHeading}>
              MakeMyPass is{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                {' '}
                Ready,
              </span>
              <br />
              for You!{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                {' '}
                Let’s Get Started!
              </span>
            </p>
          </div>
          <PricingSection />
          <div className={styles.tsTexts}>
            <p className={styles.tsHeading}>
              Don’t Just Take Our Word For It - Listen To{' '}
              <span
                style={{
                  display: 'inline-block',
                  transform: 'rotate(-2deg)',
                  marginRight: '1rem',
                }}
              >
                Our Users!
              </span>
              <br />
            </p>
          </div>
          <TestimonialSection />
          <div className={styles.footerContainer}>
            <div className={styles.fLogoText}>
              <img
                src='/app/logoText.webp'
                alt=''
                className={styles.fLogo}
                loading='lazy'
                height={20}
              />
              <p className={styles.fText}>MakeMyPass</p>
            </div>
            <p className={styles.location}>Thiruvanathapuram, Kerala, India</p>
            <div className={styles.otherLinks}>
              <Link to='/privacypolicy'>
                <p className={styles.link}>Privacy Policy</p>
              </Link>
              <Link to='/termsandconditions'>
                <p className={styles.link}>Terms and Conditions</p>
              </Link>
            </div>
          </div>
        </div>
      </Theme>
    </>
  );
};

export default LandingPage;
