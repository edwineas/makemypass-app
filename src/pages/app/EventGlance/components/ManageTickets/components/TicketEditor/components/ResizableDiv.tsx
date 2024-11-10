import React, { forwardRef, MutableRefObject, useImperativeHandle, useRef } from 'react';

import useDraggable from '../hooks/Draggable';
import styles from './ResizableDiv.module.css';

type Props = {
  children?: React.ReactNode;
  bounds: MutableRefObject<Bounds>;
  resizeEqual: boolean;
};

const ResizableDiv = forwardRef(({ children, bounds, resizeEqual }: Props, propRef) => {
  const ref = useRef<HTMLDivElement>(null);
  const data = useDraggable(ref, bounds, resizeEqual);

  useImperativeHandle(propRef, () => ({
    get position() {
      return data.position;
    },
  }));
  return (
    <div className={styles.resizable} ref={ref}>
      {children}
      <div className={styles.resizers}>
        <div className={styles.resizer + ' ' + styles['top-left']}></div>
        <div className={styles.resizer + ' ' + styles['top-right']}></div>
        <div className={styles.resizer + ' ' + styles['bottom-left']}></div>
        <div className={styles.resizer + ' ' + styles['bottom-right']}></div>
      </div>
    </div>
  );
});

export default ResizableDiv;
