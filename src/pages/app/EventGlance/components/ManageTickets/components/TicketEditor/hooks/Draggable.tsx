/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from 'react';

import { RemSize } from '../../../../../../../../common/commonFunctions';
import styles from '../components/ResizableDiv.module.css';

const Draggable = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  propBounds?: React.MutableRefObject<Bounds>,
  resizeEqual?: boolean,
) => {
  //draggable vars
  const isDragging = useRef(false);
  const position = useRef({ x: 0, y: 0 });
  const initialMousePos = useRef({ x: 0, y: 0 });

  //resizable vars
  const isResizing = useRef(false);
  const resizersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0);
  const startHeight = useRef(0);

  //resizable functions
  const initResize = useCallback((e: MouseEvent, direction?: string) => {
    console.log(direction);
    isResizing.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startWidth.current = ref.current?.offsetWidth || 0;
    startHeight.current = ref.current?.offsetHeight || 0;

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  }, []);

  const doResize = (e: MouseEvent) => {
    const width = Math.min(
      startWidth.current + (e.clientX - startX.current),
      (propBounds?.current?.right ?? 0) - (ref.current?.getBoundingClientRect().left ?? 0),
    );
    const height = Math.min(
      startHeight.current + (e.clientY - startY.current),
      (propBounds?.current?.bottom ?? 0) - (ref.current?.getBoundingClientRect().top ?? 0),
    );

    if (resizeEqual && ref.current) {
      const maxValue = Math.min(width, height);
      // const oneRem = 16;

      ref.current.style.width = `${maxValue - RemSize}px`;
      ref.current.style.height = `${maxValue - RemSize}px`;
      return;
    }

    if (ref.current) {
      ref.current.style.width = `${width - RemSize}px`;
      ref.current.style.height = `${height - RemSize}px`;
    }
  };

  const stopResize = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  }, []);

  //draggability functions
  const handleMouseDown = (e: MouseEvent) => {
    if (ref.current && ref.current.contains(e.target as Node) && isResizing.current === false) {
      isDragging.current = true;
      initialMousePos.current = {
        x: e.clientX - position.current.x,
        y: e.clientY - position.current.y,
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current && ref.current && propBounds?.current) {
      position.current = {
        x: e.clientX - initialMousePos.current.x,
        y: e.clientY - initialMousePos.current.y,
      };

      const divWidth = ref.current.getBoundingClientRect().width;
      const divHeight = ref.current.getBoundingClientRect().height;

      const bounds = {
        maxX: propBounds.current.width - divWidth,
        maxY: propBounds.current.height - divHeight,
      };

      position.current = {
        x: Math.min(Math.max(position.current.x, 0), bounds.maxX),
        y: Math.min(Math.max(position.current.y, 0), bounds.maxY),
      };

      if (position.current.x < 0 || position.current.y < 0) {
        position.current = { x: 0, y: 0 };
      }

      ref.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  //common useEffect to set up draggability and resizabiltity
  useEffect(() => {
    //resizability
    if (ref.current) {
      resizersRef.current = ref.current.querySelectorAll(`.${styles.resizer}`);
      resizersRef.current.forEach((resizer) => {
        resizer.addEventListener('mousedown', (e: MouseEvent) => {
          initResize(e, (resizer as HTMLElement).classList[1].split('_')[1]);
        });
      });
    }

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      resizersRef.current?.forEach((resizer) => {
        resizer.removeEventListener('mousedown', initResize);
      });
    };
  }, [ref, propBounds?.current]);

  const data = {
    get position() {
      return position.current;
    },
  };

  return data;
};

export default Draggable;
