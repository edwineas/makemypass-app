import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

import styles from '../Authstyles.module.css';

interface FormProps {
  type: string;
  name: string;
  id: string;
  title: string;
  placeholder?: string;
  icon: React.ReactNode;
  value?: string | string[];
  required?: boolean;
  error?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  key?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField = forwardRef<HTMLInputElement, FormProps>(({ icon, type, ...inputProps }, ref) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={styles.formInput}
      style={inputProps.style}
    >
      {inputProps.title.length > 0 && (
        <label className={styles.formLabel} htmlFor={inputProps.id}>
          {inputProps.required ? inputProps.title + '*' : inputProps.title}
        </label>
      )}
      {inputProps.description && (
        <p className={styles.fieldDescription}>{inputProps.description}</p>
      )}
      <div
        className={styles.inputField}
        style={{
          opacity: inputProps.disabled ? 0.5 : 1,
        }}
      >
        {icon}
        <input
          {...inputProps}
          type={inputType}
          disabled={inputProps.disabled}
          placeholder={`${inputProps.placeholder ? inputProps.placeholder : ''}`}
          ref={ref}
          value={inputProps.value}
          style={{
            width: '100%',
            fontFamily: 'Inter',
            opacity: inputProps.disabled ? 0.5 : 1,
          }}
        />
        {type === 'password' && (
          <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
            {inputType === 'password' ? <FaEye /> : <FaEyeSlash />}
          </span>
        )}
      </div>
      <AnimatePresence>
        {inputProps.error && inputProps?.error[0]?.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={styles.errorText}
          >{`${inputProps.error.join()}`}</motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default InputField;
