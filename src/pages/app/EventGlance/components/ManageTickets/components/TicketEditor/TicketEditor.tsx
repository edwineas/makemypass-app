import React, { createRef, useEffect, useRef, useState } from 'react';

import { TicketType } from '../../../../../../../apis/types';
// import ResizableDiv from './components/ResizableDiv';
import { options } from './data';
import useDraggable from './hooks/Draggable';
import styles from './TicketEditor.module.css';

type Props = {
  selectedTicket?: TicketType;
};

const TicketEditor = ({ selectedTicket }: Props) => {
  const [ticket, setTicket] = useState<File | null>(null);
  const bounds = useRef<Bounds>({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });
  const [loaded, setLoaded] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [natCliRatio, setNatCliRatio] = useState(1);
  const qrPosition = useDraggable(qrRef, bounds);
  const namePostion = useDraggable(nameRef, bounds);
  const descriptionPostion = useDraggable(descriptionRef, bounds);

  const handleImageLoad = () => {
    const boundingRect = imgRef.current!.getBoundingClientRect();
    bounds.current = {
      height: boundingRect.height,
      width: boundingRect.width,
      top: boundingRect.top,
      left: boundingRect.left,
      bottom: boundingRect.bottom,
      right: boundingRect.right,
    };
    setLoaded(true);
    setNatCliRatio(imgRef.current!.naturalWidth / imgRef.current!.clientWidth);
    console.log(
      imgRef.current!.naturalWidth,
      imgRef.current!.clientWidth,
      imgRef.current!.naturalHeight,
      imgRef.current!.clientHeight,
    );
  };

  const refs = useRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options.reduce((acc: { [key: string]: any }, option) => {
      acc[option.name] = createRef();
      return acc;
    }, {}),
  ).current;

  // Use useEffect to ensure refs are updated if options change
  useEffect(() => {
    options.forEach((option) => {
      if (!refs[option.name].current) {
        refs[option.name] = React.createRef();
      }
    });
    console.log(natCliRatio, qrPosition, namePostion, descriptionPostion);
  }, [descriptionPostion, namePostion, natCliRatio, qrPosition, refs]);

  // const resizableDivs = options.map((option, index) => {
  //   return (
  //     <ResizableDiv
  //       key={index}
  //       bounds={bounds}
  //       ref={refs[option.name]}
  //       resizeEqual={option.resizeEqual}
  //     >
  //       {option.name}
  //     </ResizableDiv>
  //   );
  // });

  useEffect(() => {
    for (const option of options) {
      console.log(refs[option.name]?.current?.position);
    }
  }, [refs]);

  return (
    <>
      <div className={styles.ticketEditorContainer}>
        <div className={styles.ticketEditorInputContainer}>
          {ticket || selectedTicket?.image?.file_path ? (
            <>
              <img
                src={
                  selectedTicket?.image?.file_path && !ticket
                    ? selectedTicket?.image.file_path
                    : ticket
                      ? URL.createObjectURL(ticket)
                      : undefined
                }
                className={styles.ticketEditorImage}
                ref={imgRef}
                onLoad={() => {
                  !loaded && handleImageLoad();
                }}
              />
              {/* <ResizableDiv ref={qrRef}>QR Code</ResizableDiv>
              <ResizableDiv ref={nameRef}>Name</ResizableDiv>
              <ResizableDiv ref={descriptionRef}>Description</ResizableDiv> */}
              {/* {resizableDivs} */}
            </>
          ) : (
            <>
              <label className={styles.addTicketLabel}>Upload Your Ticket</label>
              <input
                type='file'
                className={styles.ticketEditorInput}
                onChange={(e) => setTicket(e.target.files?.[0] as File)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TicketEditor;
