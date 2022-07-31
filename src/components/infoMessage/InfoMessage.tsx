import { FC } from 'react';
import './InfoMessage.css';

interface InfoMessageProps {
  message: string;
}
const InfoMessage: FC<InfoMessageProps> = ({ message }) => {
  return (
    <>
      <div className="infoMsg">
        <h2 style={{ marginBottom: '1rem' }}>Dear User,</h2>
        <p>{message}</p>
      </div>
    </>
  );
};

export default InfoMessage;
