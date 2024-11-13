import { useEffect } from 'react';

import Loader from '../../../components/Loader';

const Chat = () => {
  useEffect(() => {
    window.location.href = 'https://wa.me/916238450178';
  }, []);
  return (
    <>
      <Loader />
    </>
  );
};

export default Chat;
