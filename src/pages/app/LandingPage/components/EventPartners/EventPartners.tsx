import React, { useEffect, useState } from 'react';

import styles from './EventPartners.module.css';

type Logo = {
  src: string;
  alt: string;
  style?: React.CSSProperties;
};

const logos = [
  { src: '/app/landing/partners/Aaharam.png', alt: 'Aaharam logo' },
  { src: '/app/landing/partners/aicitk.png', alt: 'AICITK logo' },
  { src: '/app/landing/partners/artquake.png', alt: 'Artquake logo' },
  { src: '/app/landing/partners/Asset 1 1.png', alt: 'Asset logo' },
  { src: '/app/landing/partners/coffee.png', alt: 'Coffee logo' },
  { src: '/app/landing/partners/ekstep.png', alt: 'Ekstep logo' },
  { src: '/app/landing/partners/elevate.png', alt: 'Elevate logo' },
  { src: '/app/landing/partners/fabfusion.png', alt: 'Fabfusion logo' },
  { src: '/app/landing/partners/faya.png', alt: 'Faya:80 logo' },
  { src: '/app/landing/partners/flexibond.png', alt: 'Flexibond logo' },
  { src: '/app/landing/partners/Frame 17.png', alt: 'Frame 17 logo' },
  { src: '/app/landing/partners/Frame 22.png', alt: 'Frame 21 logo' },
  { src: '/app/landing/partners/hrevolve.png', alt: 'HR Evolve logo' },
  { src: '/app/landing/partners/iedc.png', alt: 'IEDC logo' },
  { src: '/app/landing/partners/iedcsummit.png', alt: 'IEDC Summit logo' },
  { src: '/app/landing/partners/ieee.png', alt: 'IEEE logo' },
  { src: '/app/landing/partners/ieeeks.png', alt: 'IEEE Kerala Section logo' },
  { src: '/app/landing/partners/in50hours.png', alt: 'In50Hours logo' },
  { src: '/app/landing/partners/initcrew.png', alt: 'Init Crew logo' },
  { src: '/app/landing/partners/keralasummit.png', alt: 'Kerala Summit logo' },
  { src: '/app/landing/partners/KSUM.png', alt: 'KSUM logo' },
  { src: '/app/landing/partners/laravel.png', alt: 'Laravel logo' },
  { src: '/app/landing/partners/lauchpad.png', alt: 'Launchpad logo' },
  { src: '/app/landing/partners/linkedin.png', alt: 'LinkedIn logo' },
  { src: '/app/landing/partners/mesc.png', alt: 'MESC logo' },
  { src: '/app/landing/partners/mulearn.png', alt: 'μLearn logo' },
  { src: '/app/landing/partners/nexus.png', alt: 'Nexus logo' },
  { src: '/app/landing/partners/nitc.png', alt: 'NITC logo' },
  { src: '/app/landing/partners/permute.png', alt: 'Permute logo' },
  { src: '/app/landing/partners/pygrammers.png', alt: 'Pygrammers logo' },
  { src: '/app/landing/partners/reflections.png', alt: 'Reflections logo' },
  { src: '/app/landing/partners/scaleup.png', alt: 'ScaleUp logo' },
  { src: '/app/landing/partners/scienceexpo.png', alt: 'Science Expo logo' },
  { src: '/app/landing/partners/sunbird.png', alt: 'Sunbird logo' },
  { src: '/app/landing/partners/thekitchen.png', alt: 'The Kitchen logo' },
  { src: '/app/landing/partners/transcend.png', alt: 'Transcend logo' },
  { src: '/app/landing/partners/zapse.png', alt: 'Zapse logo' },
];

// Function to check if logo has a horizontal aspect ratio
const getLogoClass = (logo: Logo) => {
  const horizontalLogos = ['aicitk', 'artquake', 'reflections', 'ekstep']; // List logos with known horizontal aspect
  return horizontalLogos.includes(logo.alt.toLowerCase().split(' ')[0])
    ? styles.horizontalLogo
    : '';
};

const shuffleArray = (array: Logo[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const EventPartners: React.FC = () => {
  const [shuffledLogos, setShuffledLogos] = useState<Logo[]>([]);

  useEffect(() => {
    setShuffledLogos(shuffleArray(logos));
  }, []);

  return (
    <div className={styles.eventPartnersContainer}>
      <div className={styles.marquee}>
        {shuffledLogos.map((logo, index) => (
          <img
            key={`logo-${index}`}
            className={`${styles.logo} ${getLogoClass(logo)}`}
            src={logo.src}
            alt={logo.alt}
            style={logo.style}
          />
        ))}
        {shuffledLogos.map((logo, index) => (
          <img
            key={`logo-duplicate-${index}`}
            className={`${styles.logo} ${getLogoClass(logo)}`}
            src={logo.src}
            alt={logo.alt}
            style={logo.style}
          />
        ))}
      </div>
    </div>
  );
};

export default EventPartners;
