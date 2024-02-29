import styles from './Projects.module.css';

import sup1 from '../../images/sup1.webp';
import sup2 from '../../images/sup2.webp';
import sup3 from '../../images/sup3.webp';

import p1 from '../../images/p1.webp';
import p2 from '../../images/p2.webp';
import p3 from '../../images/p3.webp';

const Projects = () => {
  return (
    <>
      <div className={styles.grad2}></div>
      <div className={styles.grad3}></div>
      <div className={styles.projectsSection}>
        <div className={styles.projectsHeading}>
          <p className={styles.projectsHeadingText}>Our Projects</p>
        </div>
        <div className={styles.projectsListing}>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>2-3rd Feb 2024</p>
              <p className={styles.projectDay}>Friday</p>
            </div>
            <div className={styles.projectDetails}>
              <div className={styles.projectTexts}>
                <p className={styles.projectHeading}>Scale Up Conclave 2024</p>
                <p className={styles.projectText}>
                  It is the first edition of an annual celebratory platform that fuses you with
                  entrepreneurs, investors, professionals, and business enthusiasts for a
                  comprehensive two-day event.
                </p>
                <div className={styles.counts}>
                  <p className={styles.countT}>
                    <span className={styles.count}>6897 </span>
                    <span className={styles.countText}>Registrations</span>
                  </p>
                  <p className={styles.countT}>
                    <span className={styles.count}>3394 </span>
                    <span className={styles.countText}>Check-Ins</span>
                  </p>
                </div>
              </div>
              <div className={styles.projectImagesContainer}>
                <div className={styles.projectImages}>
                  <img src={sup1} alt='' className={styles.projectImage} />
                  <img src={sup2} alt='' className={styles.projectImage} />
                  <img src={sup3} alt='' className={styles.projectImage} />
                </div>
                <div className={styles.projectImages}>
                  <img src={sup1} alt='' className={styles.projectImage} />
                  <img src={sup2} alt='' className={styles.projectImage} />
                  <img src={sup3} alt='' className={styles.projectImage} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>23rd Feb 2024</p>
              <p className={styles.projectDay}>Friday</p>
            </div>
            <div className={styles.projectDetails}>
              <div className={styles.projectTexts}>
                <p className={styles.projectHeading}>Permute 2024</p>
                <p className={styles.projectText}>
                  PERMUTE is µLearn’s flagship event set for February 23rd at Park Centre,
                  Technopark, Trivandrum, featuring the unveiling of µLearn 3.0.
                </p>
                <div className={styles.counts}>
                  <p className={styles.countT}>
                    <span className={styles.count}>120+ </span>
                    <span className={styles.countText}>Invites Sent via MakeMyPass</span>
                  </p>
                </div>
              </div>
              <div className={styles.projectImagesContainer}>
                <div className={styles.projectImages}>
                  <img src={p1} alt='' className={styles.projectImage} />
                  <img src={p2} alt='' className={styles.projectImage} />
                  <img src={p3} alt='' className={styles.projectImage} />
                </div>
                <div className={styles.projectImages}>
                  <img src={p1} alt='' className={styles.projectImage} />
                  <img src={p2} alt='' className={styles.projectImage} />
                  <img src={p3} alt='' className={styles.projectImage} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.project}>
            <div className={styles.projectDateDay}>
              <p className={styles.projectDate}>24th Feb 2024</p>
              <p className={styles.projectDay}>Friday</p>
            </div>
            <div className={styles.projectDetails}>
              <div className={styles.projectTexts}>
                <p className={styles.projectHeading}>In50Hours</p>
                <p className={styles.projectText}>
                  In50Hours is a 50-hour hackathon that brings together students, developers, and
                  entrepreneurs to build and launch a product and get inital funding.
                </p>
                <div className={styles.counts}>
                  <p className={styles.countT}>
                    <span className={styles.count}>Paid Event </span>
                    <span className={styles.countText}>with Razorpay</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
