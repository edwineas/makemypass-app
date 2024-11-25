import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

import { ConditionType, ErrorMessages, FormDataType, FormFieldType } from '../../apis/types';
import UploadAttachement from '../../pages/app/EventGlance/components/MailModals/UpdateMail/components/UploadAttachement/UploadAttachements.tsx';
import type { previewType } from '../../pages/app/EventGlance/components/MailModals/UpdateMail/types.ts';
import {
  customStyles,
  dynamicFormCustomStyles,
  getIcon,
} from '../../pages/app/EventPage/constants';
import InputField from '../../pages/auth/Login/InputField.tsx';
import ValidateInput from '../ValidateInput/ValidateInput.tsx';
import { validateCondition } from './condition';
import styles from './DynamicForm.module.css';
import phoneCountryCodes from './phoneCountryCodes.json';

const variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const ErrorComponent = ({
  formErrors,
  field,
  variants,
}: {
  formErrors: ErrorMessages;
  field: FormFieldType;
  variants: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    exit: { opacity: number; y: number };
  };
}) => {
  return (
    <AnimatePresence>
      {formErrors[field.field_key] && (
        <motion.p
          variants={variants}
          transition={{
            duration: 0.2,
          }}
          className={styles.errorText}
        >
          {formErrors[field.field_key][0]}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

const CommonRenderStructure = ({
  formErrors,
  field,
  children,
  title,
  description,
}: {
  formErrors: ErrorMessages;
  field: FormFieldType;
  children: JSX.Element;
  title?: string;
  description?: string;
}) => {
  const fields = ['phone', 'radio', 'checkbox', 'file'];
  return (
    <div
      style={{
        marginBottom: fields.includes(field.type) ? '16px' : '8px',
      }}
    >
      {/* FIX: This is repetative, some inputs are using the Input Container's Label and Title */}
      {title && <p className={styles.formLabel}>{title}</p>}
      {description && <p className={styles.formDescription}>{description}</p>}
      {children}
      <ErrorComponent formErrors={formErrors} field={field} variants={variants} />
    </div>
  );
};

const DynamicForm = ({
  formFields,
  formErrors,
  formData,
  onFieldChange,
  previews,
  handleFileChange,
  handleDeleteAttachment,
}: {
  formFields: FormFieldType[];
  formErrors: ErrorMessages;
  formData: FormDataType;
  onFieldChange: (fieldName: string, fieldValue: string | string[]) => void;
  previews?: previewType[];
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>, field: FormFieldType) => void;
  handleDeleteAttachment?: (index: number) => void;
}) => {
  const [phoneCode, setPhoneCode] = useState<string>('+91');

  useEffect(() => {
    //check if the formField have a key named phone if so prefill it with +91
    const phoneField = formFields.find((field) => field.field_key === 'phone');

    if (phoneField) {
      onFieldChange(phoneField.field_key, phoneCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formFields]);

  const getReactSelectOptions = () => {
    return phoneCountryCodes.map((option) => ({
      value: option.dial_code,
      label: option.name,
    }));
  };

  const findValidatingOptions = (
    options:
      | {
          values: string[];
          conditions: ConditionType[];
        }[]
      | undefined,
  ) => {
    if (!options) return options;

    const filteredOptions = options.find((option) =>
      validateCondition(option.conditions, formData, formFields),
    )?.values;

    return filteredOptions;
  };

  const resetValuesOfConditionallyRelatedFields = (field: FormFieldType) => {
    // iterate through all the fields and for each of the field check whether it has field.options and for
    // each of the field.options check whether it has conditions and if it has conditions then check whether
    // the current field id matches with the field of the condition and if it matches then reset the value
    // of the field to empty

    formFields.forEach((formField) => {
      if (formField.options) {
        formField.options.forEach((option) => {
          if (option.conditions) {
            option.conditions.forEach((condition) => {
              if (condition.field === field.id) {
                onFieldChange(formField.field_key, '');
                // Check if the resetting field also has options and conditions
                resetValuesOfConditionallyRelatedFields(formField);
              }
            });
          }
        });
      }
    });
  };

  return (
    <>
      <div className={styles.formFields}>
        {formFields?.map((field: FormFieldType) => {
          const fieldTitle = field?.title + (field.required ? '*' : '');
          if (!validateCondition(field.conditions, formData, formFields) || field.hidden)
            return null;

          if (field.type === 'text' || field.type === 'email') {
            return field.validate ? (
              <CommonRenderStructure formErrors={formErrors} field={field}>
                <ValidateInput
                  name={field.field_key}
                  placeholder={field.placeholder}
                  id={field.id}
                  key={field.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  value={formData[field.field_key] || ''}
                  type={field.type}
                  icon={getIcon(field.type)}
                  required={field.required}
                  description={field.description}
                />
              </CommonRenderStructure>
            ) : (
              <CommonRenderStructure formErrors={formErrors} field={field}>
                <InputField
                  name={field.field_key}
                  title={field?.title}
                  placeholder={field.placeholder}
                  id={field.id}
                  key={field.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  error={['']}
                  value={formData[field.field_key] || ''}
                  type={field.type}
                  icon={getIcon(field.type)}
                  required={field.required}
                  description={field.description}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'phone') {
            return (
              <>
                <CommonRenderStructure
                  formErrors={formErrors}
                  field={field}
                  title={fieldTitle}
                  description={field.description}
                >
                  <div
                    className='row'
                    style={{
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Select
                      options={getReactSelectOptions()}
                      onChange={(newValue: SingleValue<{ value: string }>) => {
                        if (newValue) {
                          onFieldChange(field.field_key, newValue.value);
                          setPhoneCode(newValue.value);
                        }
                      }}
                      styles={{
                        ...customStyles,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        control: (provided: any, state: any) => ({
                          ...provided,
                          border: 'none',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          fontFamily: 'Inter, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          minWidth: '8rem',
                          width: '100%',
                          boxShadow: state.isFocused ? 'none' : 'none', // Remove blue border on focus
                          position: 'relative', // Add this to establish a positioning context
                          zIndex: 10001, // Ensure the control stays above the menu
                        }),
                      }}
                      placeholder={`Country`}
                      isSearchable={true}
                      value={phoneCountryCodes
                        .map((option) => ({ value: option.dial_code, label: option.name }))
                        .find((option) => option.value === phoneCode)}
                    />
                    <input
                      type='text'
                      id={field.field_key}
                      name={field?.title}
                      placeholder={field.placeholder}
                      value={formData[field.field_key]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!/^[+\d]*$/.test(e.target.value)) return;
                        onFieldChange(field.field_key, e.target.value);
                      }}
                      className={styles.numberInput}
                    />
                  </div>
                </CommonRenderStructure>
              </>
            );
          } else if (field.type === 'singleselect') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <motion.div
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  className={styles.dropdown}
                >
                  <Select
                    options={
                      findValidatingOptions(field.options)?.map((option) => ({
                        value: option,
                        label: option,
                      })) ?? []
                    }
                    styles={dynamicFormCustomStyles}
                    onChange={(selectedOption: { value: string } | null) => {
                      resetValuesOfConditionallyRelatedFields(field);
                      onFieldChange(field.field_key, selectedOption?.value || '');
                    }}
                    value={
                      findValidatingOptions(field.options)
                        ?.map((option) => ({
                          value: option,
                          label: option,
                        }))
                        .filter(
                          (option: { value: string }) => option.value === formData[field.field_key],
                        ) || []
                    }
                    placeholder={`Select an option`}
                    isSearchable={true}
                  />
                </motion.div>
              </CommonRenderStructure>
            );
          } else if (field.type === 'textarea') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <motion.textarea
                  variants={variants}
                  transition={{
                    duration: 0.2,
                  }}
                  rows={4}
                  className={styles.textarea}
                  value={formData[field.field_key] || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'multiselect') {
            const selectValues =
              findValidatingOptions(field.options)?.map((option) => ({
                value: option,
                label: option,
              })) ?? [];
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <Select
                  isMulti
                  styles={customStyles}
                  name='colors'
                  value={
                    Array.isArray(formData[field.field_key])
                      ? selectValues.filter((option) =>
                          (formData[field.field_key] as string[])?.includes(option.value),
                        )
                      : []
                  }
                  options={selectValues}
                  className='basic-multi-select'
                  classNamePrefix='select'
                  onChange={(selectedOption: MultiValue<{ value: string }>) =>
                    onFieldChange(
                      field.field_key,
                      selectedOption.map((option) => option.value),
                    )
                  }
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'radio') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <div className={styles.radioContainer}>
                  {findValidatingOptions(field.options)?.map((option: string) => (
                    <div key={option} className={styles.radio}>
                      <input
                        type='radio'
                        id={option}
                        placeholder={field.placeholder}
                        name={field.field_key}
                        value={option}
                        checked={formData[field.field_key] === option}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onFieldChange(field.field_key, e.target.value)
                        }
                        className={styles.radioInput}
                      />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                </div>
              </CommonRenderStructure>
            );
          } else if (field.type === 'date') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='date'
                  id={field.field_key}
                  placeholder={field.placeholder}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.dateInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'datetime') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='datetime-local'
                  placeholder={field.placeholder}
                  id={field.field_key}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.dateInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'time') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='time'
                  id={field.field_key}
                  placeholder={field.placeholder}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.dateInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'number') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <input
                  type='number'
                  id={field.field_key}
                  placeholder={field.placeholder}
                  name={field?.title}
                  value={formData[field.field_key]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onFieldChange(field.field_key, e.target.value)
                  }
                  className={styles.numberInput}
                />
              </CommonRenderStructure>
            );
          } else if (field.type === 'rating') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`pointer ${styles.star} ${index < Number(formData[field.field_key]) ? styles.selected : ''}`}
                      onClick={() => onFieldChange(field.field_key, String(index + 1))}
                    >
                      {index < Number(formData[field.field_key]) ? '★' : '☆'}
                    </span>
                  ))}
                </>
              </CommonRenderStructure>
            );
          } else if (field.type === 'checkbox') {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <div className={styles.checkboxContainer}>
                  {findValidatingOptions(field.options)?.map((option: string) => (
                    <>
                      <div key={option} className={styles.checkbox}>
                        <input
                          type='checkbox'
                          id={option}
                          name={field.field_key}
                          value={option}
                          checked={(formData[field.field_key] as string[])?.includes(option)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;

                            if ((formData[field.field_key] as string[])?.includes(value)) {
                              const newValues = (formData[field.field_key] as string[]).filter(
                                (val) => val !== value,
                              );

                              onFieldChange(field.field_key, newValues);
                            } else {
                              onFieldChange(field.field_key, [
                                ...(formData[field.field_key] as string[]),
                                value,
                              ]);
                            }
                          }}
                          className={styles.checkboxInput}
                        />
                        <label htmlFor={option}>{option}</label>
                      </div>
                    </>
                  ))}
                </div>
              </CommonRenderStructure>
            );
          } else if (
            field.type === 'file' &&
            handleFileChange &&
            handleDeleteAttachment &&
            previews
          ) {
            return (
              <CommonRenderStructure
                formErrors={formErrors}
                field={field}
                title={fieldTitle}
                description={field.description}
              >
                <UploadAttachement
                  previews={previews}
                  handleFileChange={(event) => handleFileChange(event, field)}
                  handleDeleteAttachment={handleDeleteAttachment}
                  allowedFileTypes={field.property?.extension_types}
                />
              </CommonRenderStructure>
            );
          }
        })}
      </div>
    </>
  );
};

export default DynamicForm;
