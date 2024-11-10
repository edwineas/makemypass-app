import React, { useEffect, useRef } from 'react';

import styles from './Events.module.css';

// RightClickMenu component
interface Position {
  x: number;
  y: number;
}

interface RightClickMenuProps {
  isOpen: boolean;
  position: Position;
  onClose: () => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightClickMenu: React.FC<RightClickMenuProps> = ({
  isOpen,
  position,
  onClose,
  setShowModal,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [elementWidth, setElementWidth] = React.useState(0);
  useEffect(() => {
    if (menuRef.current) {
      setElementWidth(menuRef.current.offsetWidth);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className={styles.rightClickMenu}
      style={{
        position: 'absolute',
        top: '20%',
        left: '95%',
        transform: `translate(${position.x + 10 + elementWidth > window.innerWidth ? -elementWidth : 0}px`,
        zIndex: 1000,
      }}
    >
      <ul>
        <li
          onClick={(event) => {
            event.stopPropagation();
            setShowModal(true);
            onClose();
          }}
        >
          Duplicate Event
        </li>
      </ul>
    </div>
  );
};

export default RightClickMenu;
