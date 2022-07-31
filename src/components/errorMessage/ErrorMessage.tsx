import { FC } from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}
const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <>
      <div className="errorMsg">
        <h2 style={{ marginBottom: '1rem' }}>Something went wrong...</h2>
        <p>{message}</p>
      </div>
    </>
  );
};

export default ErrorMessage;
