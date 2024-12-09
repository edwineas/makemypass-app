import { AnimatePresence, Reorder } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import { FaAddressCard, FaRegEye, FaRegEyeSlash, FaWandMagicSparkles } from 'react-icons/fa6';
import { GrContract } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';
import { LuPlus } from 'react-icons/lu';
import { MdDelete, MdOutlineSdStorage } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { TiLockClosed } from 'react-icons/ti';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { HashLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';

import {
  closeFormMessage,
  getCloseFormMessage,
  getFormBuilderForm,
  updateFormBuilderForm,
} from '../../../apis/formbuilder';
import { isUserEditorForEvent } from '../../../common/commonFunctions';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import Editor from '../../../components/Editor/Editor';
import Modal from '../../../components/Modal/Modal';
import Slider from '../../../components/SliderButton/Slider';
import Theme from '../../../components/Theme/Theme';
import InputField from '../../auth/Login/InputField';
import { customStyles } from '../EventPage/constants';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import ChangeTypeModal from './ChangeTypeModal/ChangeTypeModal';
import GenerateWithAI from './components/GenerateWithAI';
import { DefaultFiledTypeMapping, FileExtensions, getConditions } from './constant';
import { DefaultFieldTypes, FieldType } from './enum';
import styles from './FormBuilder.module.css';
import SelectComponent from './SelectComponent';
import type { ErrorResponse, Field } from './types';

const FormBuilder = () => {
  const { event_id } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field>({} as Field);
  const [showChangeTypeModal, setShowChangeTypeModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formFieldErrors, setFormFieldErrors] = useState<ErrorResponse>({});
  const [closeForm, setCloseForm] = useState(false);
  const [showFollowUpMessage, setShowFollowUpMessage] = useState(false);
  const [followUpMessage, setFollowupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [tempFollowupMessage, setTempFollowupMessage] = useState('');
  const [showGenerateWithAI, setShowGenerateWithAI] = useState<boolean>(false);

  useEffect(() => {
    getFormBuilderForm(event_id, setFormFields, setIsLoading);
    getCloseFormMessage(event_id, setShowFollowUpMessage, setTempFollowupMessage);
  }, [event_id]);

  const updateFormStateVariable = () => {
    setFormFields([...formFields]);
  };

  const getConditionalFields = (currentField: Field) => {
    const index = formFields.findIndex((field) => field.id === currentField.id);
    return formFields.slice(0, index).map((field) => ({ label: field.title, value: field.id }));
  };

  const getConditionalFieldsForOptions = (currentField: Field, optionIndex: number) => {
    const index = formFields.findIndex((field) => field.id === currentField.id);
    return formFields
      .slice(0, index)
      .map((field) => ({
        label: field.title,
        value: field.id,
      }))
      .concat(
        currentField.options
          .slice(0, optionIndex)
          .map((option) => ({ label: option.values.join(', '), value: option.values.join(', ') })),
      );
  };

  const getFieldType = (fieldId: string) => {
    const field = formFields.find((f) => f.id === fieldId);
    if (field) {
      return field.type;
    }
    return '';
  };

  const removeOption = (field: Field, optionIndex: number, valueIndex: number) => {
    field.options[optionIndex].values.splice(valueIndex, 1);
    updateFormStateVariable();
  };

  const addOption = (field: Field, optionIndex: number) => {
    if (
      field.options[optionIndex].values.length > 0 &&
      !field.options[optionIndex].values[field.options[optionIndex].values.length - 1]
    ) {
      toast.error("Please fill the previous option's value first", {
        id: 'addOption',
      });
    } else {
      field.options[optionIndex].values.push('');
      updateFormStateVariable();
    }
  };

  const addField = (type?: FieldType, title?: string, field_key?: string) => {
    const defaultField = {
      id: uuidv4(),
      type: type || FieldType.Text,
      title: title || '',
      hidden: false,
      unique: null,
      options: [],
      property: {},
      required: true,
      field_key: field_key || 'text',
      conditions: [],
      team_field: false,
      description: null,
      placeholder: '',
    };
    setFormFields([...formFields, defaultField]);
  };

  const addOrRemoveCondition = (field: Field) => {
    if (formFieldErrors[field.field_key]) {
      delete formFieldErrors[field.field_key];
    }

    if (field.conditions.length > 0) {
      field.conditions = [];
    } else {
      field.conditions = [
        {
          field: '',
          operator: '',
          value: '',
        },
      ];
    }
    updateFormStateVariable();
  };

  const addOrRemoveOptionCondition = (field: Field, optionIndex: number) => {
    if (formFieldErrors[field.field_key]) {
      delete formFieldErrors[field.field_key];
    }

    if (field.options[optionIndex].conditions.length > 0) {
      field.options[optionIndex].conditions = [];
    } else {
      field.options[optionIndex].conditions = [
        {
          field: '',
          operator: '',
          value: '',
        },
      ];
    }
    updateFormStateVariable();
  };

  const addCondition = (field: Field) => {
    field.conditions.push({
      field: '',
      operator: '',
      value: '',
    });
    updateFormStateVariable();
  };

  const addOptionCondition = (field: Field, optionIndex: number) => {
    field.options[optionIndex].conditions.push({
      field: '',
      operator: '',
      value: '',
    });
    updateFormStateVariable();
  };

  const removeCondition = (field: Field, index: number) => {
    field.conditions.splice(index, 1);
    updateFormStateVariable();
  };

  const removeOptionCondition = (field: Field, optionIndex: number, index: number) => {
    field.options[optionIndex].conditions.splice(index, 1);
    updateFormStateVariable();
  };

  const removeField = () => {
    formFields.splice(
      formFields.findIndex((field) => field.id === selectedField.id),
      1,
    );
    updateFormStateVariable();
    setShowConfirmationModal(false);
  };

  // const removeConditionField = (field: Field, index: number) => {
  //   field.conditions.splice(index, 1);
  //   updateFormStateVariable();
  // };

  const addOrRemoveDefaultField = (title: keyof typeof DefaultFieldTypes) => {
    if (
      !formFields.some((formField) => Object.values(formField).includes(DefaultFieldTypes[title]))
    ) {
      const type: FieldType = DefaultFiledTypeMapping[DefaultFieldTypes[title]];
      const field_key: string = DefaultFieldTypes[title];

      addField(type, title, field_key);
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      const currentField = formFields.find((field) => field.field_key === DefaultFieldTypes[title]);

      if (currentField) {
        formFields.splice(
          formFields.findIndex((field) => field.id === currentField.id),
          1,
        );
        updateFormStateVariable();
      }
    }
  };

  return (
    <>
      <Theme>
        <DashboardLayout prevPage='/events' tabName='formbuilder'>
          <Modal
            isOpen={showConfirmationModal}
            type='center'
            title='Confirmation'
            onClose={() => setShowConfirmationModal(false)}
          >
            <div className={styles.confirmationModal}>
              <p>Are you sure you want to delete this field?</p>
              <div className={styles.confirmationButtons}>
                <button onClick={() => removeField()}>Yes</button>
                <button onClick={() => setShowConfirmationModal(false)}>No</button>
              </div>
            </div>
          </Modal>

          {import.meta.env.VITE_CURRENT_ENV == 'dev' && (
            <Modal
              isOpen={showGenerateWithAI}
              onClose={() => setShowGenerateWithAI(false)}
              title='Build Your Form with AI'
            >
              <GenerateWithAI />
            </Modal>
          )}

          <Modal
            isOpen={closeForm}
            type='center'
            title='Enter Message'
            onClose={() => setCloseForm(false)}
          >
            <div className={styles.followupMessageContainer}>
              <label className={styles.headingText}>Form Closed Message</label>
              <p className={styles.subText}>
                This message will be shown once the form has been closed.
              </p>
              <div className={styles.followupMessage}>
                <Editor description={tempFollowupMessage} setNewDescription={setFollowupMessage} />
              </div>
              <br />
              <Slider
                checked={showFollowUpMessage}
                text={'Close Registration Form'}
                onChange={() => {
                  isUserEditorForEvent() && setShowFollowUpMessage(!showFollowUpMessage);
                }}
                size='small'
              />
              <button
                className={styles.continueButton}
                onClick={() => {
                  if (isUserEditorForEvent())
                    closeFormMessage(event_id, followUpMessage, showFollowUpMessage);
                }}
              >
                Continue
              </button>
            </div>
          </Modal>

          <div className={styles.requiredFieldsHeader}>
            <div className={styles.requiredFieldsHeader}>
              <div className={styles.requiredHeading}>
                <div className={styles.image}>
                  <FaAddressCard size={20} color='#ffffff' />
                </div>
                <p className={styles.requiredFieldsText}>Default Fields</p>
              </div>

              <div className={styles.requiredFields}>
                {Object.entries(DefaultFieldTypes).map(([key, value]) => {
                  return (
                    <div className={styles.requiredField}>
                      <div>
                        <p className={styles.requiredLabel}>{key}</p>
                      </div>
                      <Slider
                        checked={formFields.some((formField) =>
                          Object.values(formField).includes(value),
                        )}
                        text={''}
                        onChange={() =>
                          isUserEditorForEvent() &&
                          addOrRemoveDefaultField(key as keyof typeof DefaultFieldTypes)
                        }
                        size='small'
                      />
                    </div>
                  );
                })}
              </div>
              <p className={styles.requiredFieldDescription}>
                *These are important fields for managing insights. Use the slider to add such a
                field to your form instead of creating it yourself.
              </p>
            </div>
            <div className={styles.customFieldsContainer}>
              <div className={styles.customFieldsHeader}>
                <div className={styles.customFieldsHeading}>
                  <div
                    className={styles.image}
                    style={{
                      backgroundColor: '#FF9641',
                    }}
                  >
                    <FaAddressCard size={20} color='#ffffff' />
                  </div>
                  <p className={styles.customFieldsText}>Custom Fields</p>
                </div>
                <div className='row'>
                  {import.meta.env.CURRENT_ENV == 'dev' && (
                    <button
                      className={styles.generateWithAIButton}
                      onClick={() => {
                        setShowGenerateWithAI(true);
                      }}
                    >
                      {' '}
                      <FaWandMagicSparkles /> Generate With AI
                    </button>
                  )}
                  <button
                    className={styles.generateWithAIButton}
                    onClick={() => {
                      setCloseForm(true);
                    }}
                    style={
                      showFollowUpMessage
                        ? {
                            backgroundColor: '#f04b4b',
                            color: '#ffffff',
                          }
                        : { background: 'rgba(255, 255, 255, 0.08)', color: '#fff' }
                    }
                  >
                    <TiLockClosed /> {showFollowUpMessage ? 'Form Closed' : 'Close Form'}
                  </button>
                </div>
              </div>

              {!isLoading ? (
                <div className={styles.customFields}>
                  <Reorder.Group values={formFields} onReorder={setFormFields}>
                    {formFields.map((field, idx) => {
                      return (
                        <Reorder.Item value={field} key={field.id}>
                          {field.id !== selectedField.id ? (
                            <div
                              className={`pointer ${styles.customField}`}
                              key={idx}
                              onClick={() => {
                                setSelectedField(field);
                              }}
                              style={
                                formFieldErrors[field.field_key]
                                  ? {
                                      border: '2px solid #f04b4b',
                                      borderRadius: '5px',
                                    }
                                  : {}
                              }
                            >
                              <div className={styles.row1}>
                                <RxDragHandleDots2 size={25} color='#606264' id={field.id} />
                                <div>
                                  <p
                                    className={`pointer ${styles.customFieldLabel}`}
                                    style={{
                                      whiteSpace: 'nowrap',
                                    }}
                                    onClick={() => {
                                      setSelectedField(field);
                                      setShowChangeTypeModal(true);
                                    }}
                                  >
                                    {(Object.keys(FieldType) as Array<keyof typeof FieldType>).find(
                                      (key) => FieldType[key] === field.type,
                                    )}{' '}
                                    <FaChevronDown size={15} color='989999' />
                                  </p>
                                  <p className={styles.customFieldType}>{field.title}</p>
                                </div>
                              </div>
                              <CgArrowsExpandRight size={20} color='#606264' />
                            </div>
                          ) : (
                            <div
                              className={styles.customFieldExp}
                              key={idx}
                              style={
                                formFieldErrors[field.field_key]
                                  ? {
                                      border: '2px solid #f04b4b',
                                      borderRadius: '5px',
                                    }
                                  : {}
                              }
                            >
                              <div className={styles.row}>
                                <div className={styles.row1}>
                                  <RxDragHandleDots2 size={25} color='#606264' />
                                  <p
                                    className={`pointer ${styles.customFieldLabel}`}
                                    onClick={() => {
                                      setSelectedField(field);
                                      setShowChangeTypeModal(!showChangeTypeModal);
                                    }}
                                  >
                                    {(Object.keys(FieldType) as Array<keyof typeof FieldType>).find(
                                      (key) => FieldType[key] === field.type,
                                    )}

                                    <FaChevronDown size={15} color='989999' />
                                  </p>
                                </div>

                                <div className={styles.expandedRight}>
                                  <div className={styles.requiredCheckbox}>
                                    <Slider
                                      checked={field.required}
                                      text={'Required'}
                                      onChange={() => {
                                        if (isUserEditorForEvent()) {
                                          field.required = !field.required;
                                          updateFormStateVariable();
                                        }
                                      }}
                                      size='small'
                                    />
                                  </div>

                                  <div className={styles.iconsContainer}>
                                    {field.hidden ? (
                                      <FaRegEyeSlash
                                        className='pointer'
                                        size={25}
                                        color='#606264'
                                        onClick={() => {
                                          field.hidden = !field.hidden;
                                          updateFormStateVariable();
                                        }}
                                      />
                                    ) : (
                                      <FaRegEye
                                        className='pointer'
                                        size={25}
                                        color='#606264'
                                        onClick={() => {
                                          if (isUserEditorForEvent()) {
                                            field.hidden = !field.hidden;
                                            updateFormStateVariable();
                                          }
                                        }}
                                      />
                                    )}
                                    <GrContract
                                      className='pointer'
                                      size={20}
                                      color='#606264'
                                      onClick={() => {
                                        if (isUserEditorForEvent()) setSelectedField({} as Field);
                                      }}
                                    />
                                  </div>

                                  {isUserEditorForEvent() && (
                                    <MdDelete
                                      className={styles.deleteIcon}
                                      size={25}
                                      color='#606264'
                                      onClick={() => {
                                        setSelectedField(field);
                                        setShowConfirmationModal(true);
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <AnimatePresence>
                                <div className={styles.changeTypeContainer}>
                                  {showChangeTypeModal && (
                                    <ChangeTypeModal
                                      field={field}
                                      setShowChangeTypeModal={setShowChangeTypeModal}
                                    />
                                  )}
                                </div>
                              </AnimatePresence>

                              <div className={styles.customFieldName}>
                                <input
                                  type='text'
                                  title='Field Name'
                                  placeholder='Field Name'
                                  disabled={!isUserEditorForEvent()}
                                  value={field.title}
                                  onChange={(event) => {
                                    if (isUserEditorForEvent()) {
                                      field.title = event.target.value;

                                      if (
                                        !Array.from(Object.values(DefaultFieldTypes)).includes(
                                          field.field_key as DefaultFieldTypes,
                                        )
                                      )
                                        field.field_key = event.target.value
                                          .toLowerCase()
                                          .replace(/ /g, '_');

                                      updateFormStateVariable();
                                    }
                                  }}
                                />
                              </div>
                              <div className={styles.customFieldName}>
                                <input
                                  type='text'
                                  disabled={!isUserEditorForEvent()}
                                  placeholder='Field Description'
                                  title='Add Some help text.'
                                  value={field.description || ''}
                                  onChange={(event) => {
                                    if (isUserEditorForEvent()) {
                                      field.description = event.target.value;
                                      updateFormStateVariable();
                                    }
                                  }}
                                />
                              </div>
                              <div className={styles.customFieldName}>
                                <input
                                  type='text'
                                  disabled={!isUserEditorForEvent()}
                                  placeholder='Field Placeholder'
                                  title='Add Some help text.'
                                  value={field.placeholder || ''}
                                  onChange={(event) => {
                                    if (isUserEditorForEvent()) {
                                      field.placeholder = event.target.value;
                                      updateFormStateVariable();
                                    }
                                  }}
                                />
                              </div>

                              {field.options &&
                                (field.type === FieldType.Radio ||
                                  field.type === FieldType.Checkbox ||
                                  field.type === FieldType.SingleSelect ||
                                  field.type === FieldType.MultiSelect) && (
                                  <div className={styles.customFieldOption}>
                                    {field.options.length == 0 && (
                                      <button
                                        onClick={() => {
                                          if (isUserEditorForEvent()) {
                                            field.options.push({
                                              values: [''],
                                              conditions: [],
                                            });
                                            updateFormStateVariable();
                                          }
                                        }}
                                        style={{
                                          marginTop: '1rem',
                                        }}
                                        className={styles.addOption}
                                      >
                                        Add Option Group
                                      </button>
                                    )}
                                    {field.options.map((optionsObject, optionIndex) => (
                                      <div className={styles.optionValuesContainer}>
                                        <div
                                          className='row'
                                          style={{
                                            justifyContent: 'space-between',
                                          }}
                                        >
                                          <p className={styles.optionHeader}>
                                            Option Group {optionIndex + 1}
                                          </p>
                                          <div className='row'>
                                            <SecondaryButton
                                              buttonText='Add'
                                              icon={<FaPlus size={10} color='#fff' />}
                                              onClick={() => {
                                                if (
                                                  (field.options.length > 0 &&
                                                    field.options[field.options.length - 1].values
                                                      .length === 0) ||
                                                  field.options[field.options.length - 1].values[0]
                                                    .length === 0
                                                ) {
                                                  toast.error(
                                                    "Please fill the previous option group's value first",
                                                    {
                                                      id: 'addOptionGroup',
                                                    },
                                                  );
                                                  return;
                                                }
                                                if (isUserEditorForEvent()) {
                                                  field.options.push({
                                                    values: [''],
                                                    conditions: [],
                                                  });
                                                  updateFormStateVariable();
                                                }
                                              }}
                                            />
                                            <SecondaryButton
                                              buttonText='Remove'
                                              icon={<MdDelete size={15} color='#fff' />}
                                              onClick={() => {
                                                if (isUserEditorForEvent()) {
                                                  field.options.splice(optionIndex, 1);
                                                  updateFormStateVariable();
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className={styles.optionValues}>
                                          {optionsObject.values.map((option, valueIndex) => (
                                            <div
                                              className='row'
                                              key={valueIndex}
                                              style={{
                                                flexWrap: 'nowrap',
                                              }}
                                            >
                                              <input
                                                className={styles.optionInput}
                                                type='text'
                                                disabled={!isUserEditorForEvent()}
                                                title='Option'
                                                placeholder='Option Value'
                                                value={option}
                                                onChange={(event) => {
                                                  if (isUserEditorForEvent()) {
                                                    field.options[optionIndex].values[valueIndex] =
                                                      event.target.value;
                                                    updateFormStateVariable();
                                                  }
                                                }}
                                              />
                                              <IoCloseSharp
                                                className='pointer'
                                                onClick={() => {
                                                  isUserEditorForEvent() &&
                                                    removeOption(field, optionIndex, valueIndex);
                                                }}
                                                size={20}
                                                color='#606264'
                                              />
                                            </div>
                                          ))}
                                          {isUserEditorForEvent() && (
                                            <button
                                              onClick={() => {
                                                if (isUserEditorForEvent())
                                                  addOption(field, optionIndex);
                                              }}
                                              className={styles.addOption}
                                            >
                                              Add New Option
                                            </button>
                                          )}
                                        </div>
                                        {getConditionalFieldsForOptions(field, optionIndex)
                                          .length >= 0 && (
                                          <div
                                            className={styles.row1}
                                            style={{
                                              marginTop: '1rem',
                                            }}
                                          >
                                            <Slider
                                              checked={
                                                field.options[optionIndex].conditions.length > 0
                                              }
                                              text={''}
                                              onChange={() => {
                                                isUserEditorForEvent() &&
                                                  addOrRemoveOptionCondition(field, optionIndex);
                                              }}
                                              size='small'
                                            />
                                            <p className={styles.customFieldLabel}>Add Condition</p>
                                          </div>
                                        )}

                                        {field.options[optionIndex].conditions.length > 0 && (
                                          <div className={styles.conditions}>
                                            {field.options[optionIndex].conditions.map(
                                              (condition, idx) => (
                                                <div
                                                  className={styles.optionConditionRow}
                                                  key={idx}
                                                >
                                                  <p className={styles.when}>
                                                    {idx === 0 ? 'When' : 'And'}
                                                  </p>
                                                  <div className={styles.conditionsSelect}>
                                                    <SelectComponent
                                                      options={getConditionalFieldsForOptions(
                                                        field,
                                                        optionIndex,
                                                      )}
                                                      value={condition.field}
                                                      onChange={(
                                                        option: {
                                                          value: string;
                                                          label: string;
                                                        } | null,
                                                      ) => {
                                                        if (isUserEditorForEvent()) {
                                                          if (!option) condition.field = '';
                                                          else condition.field = option.value;

                                                          updateFormStateVariable();
                                                        }
                                                      }}
                                                    />
                                                    <SelectComponent
                                                      options={[
                                                        ...getConditions(
                                                          getFieldType(condition.field),
                                                        ).map((condition) => ({
                                                          value: condition.value,
                                                          label: condition.label,
                                                        })),
                                                      ]}
                                                      value={condition.operator}
                                                      onChange={(
                                                        option: {
                                                          value: string;
                                                          label: string;
                                                        } | null,
                                                      ) => {
                                                        if (isUserEditorForEvent()) {
                                                          if (!option) condition.operator = '';
                                                          else condition.operator = option.value;
                                                          updateFormStateVariable();
                                                        }
                                                      }}
                                                    />
                                                    {condition.operator !== 'empty' &&
                                                      condition.operator !== 'not empty' &&
                                                      ([
                                                        FieldType.SingleSelect,
                                                        FieldType.MultiSelect,
                                                        FieldType.Checkbox,
                                                        FieldType.Radio,
                                                      ].includes(
                                                        formFields.find(
                                                          (field) => field.id === condition.field,
                                                        )?.type ?? FieldType.Text,
                                                      ) ? (
                                                        condition.operator === 'in' ||
                                                        condition.operator === 'not in' ? (
                                                          <Select
                                                            isDisabled={!isUserEditorForEvent()}
                                                            isMulti
                                                            styles={{
                                                              ...customStyles,
                                                              control: (provided) => ({
                                                                ...provided,
                                                                minWidth: '15rem',
                                                              }),
                                                            }}
                                                            name='colors'
                                                            value={
                                                              !Array.isArray(condition.value)
                                                                ? []
                                                                : condition.value.map((value) => ({
                                                                    value,
                                                                    label: value,
                                                                  }))
                                                            }
                                                            options={
                                                              formFields
                                                                .find(
                                                                  (field) =>
                                                                    field.id === condition.field,
                                                                )
                                                                ?.options?.flatMap(
                                                                  (option) => option.values,
                                                                )
                                                                .map((value) => ({
                                                                  value,
                                                                  label: value,
                                                                })) || []
                                                            }
                                                            className='basic-multi-select'
                                                            classNamePrefix='select'
                                                            onChange={(selectedOptions) => {
                                                              condition.value = selectedOptions.map(
                                                                (option) => option.value,
                                                              );
                                                              updateFormStateVariable();
                                                            }}
                                                          />
                                                        ) : (
                                                          <SelectComponent
                                                            options={
                                                              formFields
                                                                .find(
                                                                  (field) =>
                                                                    field.id === condition.field,
                                                                )
                                                                ?.options?.flatMap(
                                                                  (option) => option.values,
                                                                )
                                                                .map((value) => ({
                                                                  value,
                                                                  label: value,
                                                                })) || []
                                                            }
                                                            value={
                                                              !Array.isArray(condition.value)
                                                                ? condition.value
                                                                : ''
                                                            }
                                                            onChange={(
                                                              option: {
                                                                value: string;
                                                                label: string;
                                                              } | null,
                                                            ) => {
                                                              if (isUserEditorForEvent()) {
                                                                if (!option) condition.value = '';
                                                                else condition.value = option.value;
                                                                updateFormStateVariable();
                                                              }
                                                            }}
                                                          />
                                                        )
                                                      ) : condition.operator === 'in' ||
                                                        condition.operator === 'not in' ? (
                                                        <CreatableSelect
                                                          isDisabled={!isUserEditorForEvent()}
                                                          styles={customStyles}
                                                          options={
                                                            formFields
                                                              .find(
                                                                (field) =>
                                                                  field.id === condition.field,
                                                              )
                                                              ?.options?.flatMap(
                                                                (option) => option.values,
                                                              )
                                                              .map((value) => ({
                                                                value,
                                                                label: value,
                                                              })) || []
                                                          }
                                                          value={
                                                            condition.value &&
                                                            Array.isArray(condition.value)
                                                              ? condition.value.map((value) => ({
                                                                  value,
                                                                  label: value,
                                                                }))
                                                              : []
                                                          }
                                                          onChange={(selectedOptions) => {
                                                            condition.value = selectedOptions.map(
                                                              (option) => option.value,
                                                            );

                                                            updateFormStateVariable();
                                                          }}
                                                          isMulti
                                                        />
                                                      ) : (
                                                        <input
                                                          disabled={!isUserEditorForEvent()}
                                                          type='text'
                                                          title='Value'
                                                          value={condition.value}
                                                          onChange={(event) => {
                                                            condition.value = event.target.value;
                                                            updateFormStateVariable();
                                                          }}
                                                        />
                                                      ))}
                                                    {isUserEditorForEvent() && (
                                                      <>
                                                        <RiDeleteBinLine
                                                          className='pointer'
                                                          size={20}
                                                          color='#606264'
                                                          onClick={() => {
                                                            removeOptionCondition(
                                                              field,
                                                              optionIndex,
                                                              idx,
                                                            );
                                                          }}
                                                        />
                                                        <LuPlus
                                                          className='pointer'
                                                          style={{
                                                            marginLeft: '0.5rem',
                                                          }}
                                                          size={20}
                                                          color='#606264'
                                                          onClick={() => {
                                                            addOptionCondition(field, optionIndex);
                                                          }}
                                                        />
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                              <div className={styles.centerRow}>
                                <div className={styles.uniqueField}>
                                  <InputField
                                    name='unique'
                                    disabled={!isUserEditorForEvent()}
                                    id='unique'
                                    icon={<FaRegEyeSlash size={20} color='#606264' />}
                                    type='number'
                                    title='Unique'
                                    description='This count indicates the number of times a value can be entered uniquely'
                                    value={field.unique?.toString()}
                                    onChange={(event) => {
                                      if (isUserEditorForEvent()) {
                                        if (parseInt(event.target.value) < 1)
                                          event.target.value = '1';
                                        field.unique = parseInt(event.target.value);
                                        updateFormStateVariable();
                                      }
                                    }}
                                  />

                                  {(field.type === FieldType.Text ||
                                    field.type === FieldType.LongText) && (
                                    <>
                                      <InputField
                                        name='max_length'
                                        disabled={!isUserEditorForEvent()}
                                        id='max_length'
                                        icon={<></>}
                                        type='number'
                                        title='Max Length'
                                        description='Enter the maximum length of the field'
                                        value={field.property?.max_length?.toString()}
                                        onChange={(event) => {
                                          if (isUserEditorForEvent()) {
                                            if (parseInt(event.target.value) < 1)
                                              event.target.value = '1';
                                            field.property.max_length = parseInt(
                                              event.target.value,
                                            );
                                            updateFormStateVariable();
                                          }
                                        }}
                                      />

                                      <InputField
                                        name='min_length'
                                        id='min_length'
                                        disabled={!isUserEditorForEvent()}
                                        icon={<></>}
                                        type='number'
                                        title='Min Length'
                                        description='Enter the minimum length of the field'
                                        value={field.property?.min_length?.toString()}
                                        onChange={(event) => {
                                          if (isUserEditorForEvent()) {
                                            if (parseInt(event.target.value) < 1)
                                              event.target.value = '1';
                                            field.property.min_length = parseInt(
                                              event.target.value,
                                            );
                                            updateFormStateVariable();
                                          }
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                              {field.type === FieldType.File && (
                                <div className={styles.customFieldOption}>
                                  <div className={styles.customFieldOptionRow}>
                                    <div>
                                      <label className={styles.customFieldOptionLabel}>
                                        Allowed Extensions
                                      </label>
                                      <p className={styles.formLabel}>
                                        Select the file extensions allowed.
                                      </p>
                                      <Select
                                        isMulti
                                        isSearchable
                                        isDisabled={!isUserEditorForEvent()}
                                        styles={customStyles}
                                        options={FileExtensions}
                                        value={field?.property?.extension_types?.map((ext) => ({
                                          value: ext,
                                          label: ext,
                                        }))}
                                        onChange={(selectedOptions) => {
                                          field.property.extension_types = selectedOptions.map(
                                            (option) => option.value,
                                          );
                                          updateFormStateVariable();
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <InputField
                                        name='max_size'
                                        id='max_size'
                                        icon={<MdOutlineSdStorage size={20} color='#606264' />}
                                        type='number'
                                        title='Maximal File Size'
                                        disabled={!isUserEditorForEvent()}
                                        description='Maximal file size in KB(1mb = 1024kb)'
                                        value={field?.property?.max_size?.toString()}
                                        onChange={(event) => {
                                          if (parseInt(event.target.value) > 5000)
                                            event.target.value = '5000';
                                          field.property.max_size = parseInt(event.target.value);
                                          updateFormStateVariable();
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <InputField
                                        name='max_no_of_files'
                                        id='max_no_of_files'
                                        disabled={!isUserEditorForEvent()}
                                        icon={<MdOutlineSdStorage size={20} color='#606264' />}
                                        type='number'
                                        title='Enter max no of files'
                                        description='Max.number of files that can be uploaded'
                                        value={field?.property?.max_no_of_files?.toString()}
                                        onChange={(event) => {
                                          if (parseInt(event.target.value) < 1)
                                            event.target.value = '1';
                                          field.property.max_no_of_files = parseInt(
                                            event.target.value,
                                          );
                                          updateFormStateVariable();
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {getConditionalFields(field).length >= 0 && (
                                <div
                                  className={styles.row1}
                                  style={{
                                    marginTop: '1rem',
                                    marginLeft: '1.25rem',
                                  }}
                                >
                                  <Slider
                                    checked={field.conditions?.length > 0}
                                    text={''}
                                    onChange={() => {
                                      isUserEditorForEvent() && addOrRemoveCondition(field);
                                    }}
                                    size='small'
                                  />
                                  <p className={styles.customFieldLabel}>
                                    Show Field only when the conditions are met.
                                  </p>
                                </div>
                              )}

                              {field.conditions?.length > 0 && (
                                <div className={styles.conditions}>
                                  {field.conditions.map((condition, idx) => (
                                    <div
                                      className={styles.optionConditionRow}
                                      key={idx}
                                      style={{
                                        marginLeft: '1.75rem',
                                      }}
                                    >
                                      <p className={styles.when}>{idx === 0 ? 'When' : 'And'}</p>
                                      <div className={styles.conditionsSelect}>
                                        <SelectComponent
                                          options={getConditionalFields(field)}
                                          value={condition.field}
                                          onChange={(
                                            option: { value: string; label: string } | null,
                                          ) => {
                                            if (isUserEditorForEvent()) {
                                              if (!option) condition.field = '';
                                              else condition.field = option.value;

                                              updateFormStateVariable();
                                            }
                                          }}
                                        />
                                        <SelectComponent
                                          options={[
                                            ...getConditions(getFieldType(condition.field)).map(
                                              (condition) => ({
                                                value: condition.value,
                                                label: condition.label,
                                              }),
                                            ),
                                          ]}
                                          value={condition.operator}
                                          onChange={(
                                            option: { value: string; label: string } | null,
                                          ) => {
                                            if (isUserEditorForEvent()) {
                                              if (!option) condition.operator = '';
                                              else condition.operator = option.value;
                                              updateFormStateVariable();
                                            }
                                          }}
                                        />
                                        {condition.operator !== 'empty' &&
                                          condition.operator !== 'not empty' &&
                                          ([
                                            FieldType.SingleSelect,
                                            FieldType.MultiSelect,
                                            FieldType.Checkbox,
                                            FieldType.Radio,
                                          ].includes(
                                            formFields.find((field) => field.id === condition.field)
                                              ?.type ?? FieldType.Text,
                                          ) ? (
                                            condition.operator === 'in' ||
                                            condition.operator === 'not in' ? (
                                              <Select
                                                isDisabled={!isUserEditorForEvent()}
                                                isMulti
                                                styles={customStyles}
                                                name='colors'
                                                value={
                                                  !Array.isArray(condition.value)
                                                    ? []
                                                    : condition.value.map((value) => ({
                                                        value,
                                                        label: value,
                                                      }))
                                                }
                                                options={
                                                  formFields
                                                    .find((field) => field.id === condition.field)
                                                    ?.options?.flatMap((option) => option.values)
                                                    .map((value) => ({
                                                      value,
                                                      label: value,
                                                    })) || []
                                                }
                                                className='basic-multi-select'
                                                classNamePrefix='select'
                                                onChange={(selectedOptions) => {
                                                  condition.value = selectedOptions.map(
                                                    (option) => option.value,
                                                  );
                                                  updateFormStateVariable();
                                                }}
                                              />
                                            ) : (
                                              <SelectComponent
                                                options={
                                                  formFields
                                                    .find((field) => field.id === condition.field)
                                                    ?.options?.flatMap((option) => option.values)
                                                    .map((value) => ({
                                                      value,
                                                      label: value,
                                                    })) || []
                                                }
                                                value={
                                                  !Array.isArray(condition.value)
                                                    ? condition.value
                                                    : ''
                                                }
                                                onChange={(
                                                  option: { value: string; label: string } | null,
                                                ) => {
                                                  if (isUserEditorForEvent()) {
                                                    if (!option) condition.value = '';
                                                    else condition.value = option.value;
                                                    updateFormStateVariable();
                                                  }
                                                }}
                                              />
                                            )
                                          ) : condition.operator === 'in' ||
                                            condition.operator === 'not in' ? (
                                            <CreatableSelect
                                              isDisabled={!isUserEditorForEvent()}
                                              styles={customStyles}
                                              options={
                                                formFields
                                                  .find((field) => field.id === condition.field)
                                                  ?.options?.flatMap((option) => option.values)
                                                  .map((value) => ({
                                                    value,
                                                    label: value,
                                                  })) || []
                                              }
                                              value={
                                                condition.value && Array.isArray(condition.value)
                                                  ? condition.value.map((value) => ({
                                                      value,
                                                      label: value,
                                                    }))
                                                  : []
                                              }
                                              onChange={(selectedOptions) => {
                                                condition.value = selectedOptions.map(
                                                  (option) => option.value,
                                                );

                                                updateFormStateVariable();
                                              }}
                                              isMulti
                                            />
                                          ) : (
                                            <input
                                              disabled={!isUserEditorForEvent()}
                                              type='text'
                                              title='Value'
                                              value={condition.value}
                                              onChange={(event) => {
                                                condition.value = event.target.value;
                                                updateFormStateVariable();
                                              }}
                                            />
                                          ))}
                                        {isUserEditorForEvent() && (
                                          <>
                                            <RiDeleteBinLine
                                              className='pointer'
                                              size={20}
                                              color='#606264'
                                              onClick={() => {
                                                removeCondition(field, idx);
                                              }}
                                            />
                                            <LuPlus
                                              className='pointer'
                                              style={{
                                                marginLeft: '0.5rem',
                                              }}
                                              size={20}
                                              color='#606264'
                                              onClick={() => {
                                                addCondition(field);
                                              }}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {formFieldErrors[field.field_key] && (
                                <div className={styles.error}>
                                  {formFieldErrors[field.field_key].map((error) => (
                                    <p>{error}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Reorder.Item>
                      );
                    })}
                  </Reorder.Group>
                  <br />

                  <div className={styles.actionButtonsContainer}>
                    <div className={styles.actionButtons}>
                      {isUserEditorForEvent() && (
                        <button
                          onClick={() => {
                            addField();
                          }}
                          className={styles.addQuestionButton}
                        >
                          <span>+</span>Add Question
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setFormFieldErrors({});
                        if (isUserEditorForEvent())
                          updateFormBuilderForm(event_id, formFields, setFormFieldErrors);
                      }}
                      className={styles.saveFormButton}
                    >
                      Save Form
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.loaderContainer}>
                  <HashLoader color={'#46BF75'} size={50} />
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      </Theme>
    </>
  );
};

export default FormBuilder;
