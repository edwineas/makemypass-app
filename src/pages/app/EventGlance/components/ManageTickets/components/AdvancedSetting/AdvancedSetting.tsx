import React from 'react';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { v4 as uuidv4 } from 'uuid';

import { TicketType } from '../../../../../../../apis/types';
import { isUserEditorForEvent } from '../../../../../../../common/commonFunctions';
import Slider from '../../../../../../../components/SliderButton/Slider';
import InputField from '../../../../../../auth/Login/InputField';
import { customStyles } from '../../../../../EventPage/constants';
// import Slider from '../../../../../../../components/SliderButton/Slider';
import styles from './AdvancedSetting.module.css';
import SelectMultipleDates from './components/SelectMultipleDates';

type Props = {
  selectedTicket: TicketType;
  setSelectedTicket: React.Dispatch<React.SetStateAction<TicketType | undefined>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdvancedSetting = ({ selectedTicket, setSelectedTicket, setIsOpen }: Props) => {
  const convertToMultiValue = (strings: string[]): MultiValue<{ label: string; value: string }> => {
    return strings.map((str) => ({ label: str, value: str }));
  };
  // Handle input change
  const handleChange = (newValue: MultiValue<{ label: string; value: string }>) => {
    setSelectedTicket({
      ...selectedTicket,
      private_registration: newValue.map((option) => option.value),
    } as TicketType);
  };
  return (
    <>
      <InputField
        type='text'
        name='code_prefix'
        id='code_prefix'
        disabled={!isUserEditorForEvent()}
        icon={<></>}
        title='Code Prefix'
        placeholder='Eg, PS123'
        value={selectedTicket?.code_prefix}
        onChange={(e) =>
          setSelectedTicket({ ...selectedTicket, code_prefix: e.target.value } as TicketType)
        }
      />

      <InputField
        type='number'
        name='code_suffix'
        id='code_suffix'
        disabled={!isUserEditorForEvent()}
        icon={<></>}
        title='No of digits'
        value={selectedTicket?.code_digits.toString()}
        onChange={(e) =>
          setSelectedTicket({
            ...selectedTicket,
            code_digits: Number(e.target.value),
          } as TicketType)
        }
      />

      <InputField
        type='number'
        name='user_count'
        id='user_count'
        disabled={!isUserEditorForEvent()}
        icon={<></>}
        title='User Count'
        value={selectedTicket?.user_count.toString()}
        onChange={(e) => {
          if (Number(e.target.value) < 1) {
            e.target.value = '1';
          }
          setSelectedTicket({
            ...selectedTicket,
            user_count: Number(e.target.value),
          } as TicketType);
        }}
      />

      <InputField
        type='text'
        name='category'
        id='Category'
        disabled={!isUserEditorForEvent()}
        icon={<></>}
        title='Category'
        value={selectedTicket?.category}
        onChange={(e) =>
          setSelectedTicket({ ...selectedTicket, category: e.target.value } as TicketType)
        }
      />

      <InputField
        type='number'
        name='commission'
        id='Commission'
        icon={<></>}
        title='Commission'
        value={selectedTicket?.commission?.toString()}
        onChange={(e) =>
          setSelectedTicket({ ...selectedTicket, commission: Number(e.target.value) })
        }
      />

      <SelectMultipleDates
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        title='Allowed Dates'
      />
      <div className={styles.privateRegContainer}>
        <label className={styles.privateRegLabel}>Private Registration</label>
        <CreatableSelect
          isMulti
          value={convertToMultiValue(selectedTicket?.private_registration || [])}
          onChange={handleChange}
          placeholder='Type and press enter to add'
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          noOptionsMessage={() => null}
          components={{ DropdownIndicator: null, IndicatorSeparator: null }}
          styles={customStyles}
        />
      </div>

      <div className={styles.ticketSlider}>
        <p className={styles.perksLabel}>Perks</p>
        <Slider
          checked={selectedTicket?.perks.length > 0}
          onChange={() => {
            if (selectedTicket && isUserEditorForEvent()) {
              setSelectedTicket({
                ...selectedTicket,
                perks:
                  selectedTicket.perks.length > 0 ? [] : [{ id: uuidv4(), name: '', count: 1 }],
              } as TicketType);
            }
          }}
        />
      </div>

      {selectedTicket && selectedTicket.perks.length > 0 && (
        <div className={styles.perksList}>
          {selectedTicket.perks.map((perk, index) => (
            <div key={index} className={styles.perkItem}>
              <input
                type='text'
                disabled={!isUserEditorForEvent()}
                placeholder='Perk Name'
                value={perk.name}
                onChange={(e) => {
                  setSelectedTicket((prevTicket) => {
                    if (prevTicket) {
                      const updatedPerks = [...prevTicket.perks];
                      updatedPerks[index].name = e.target.value;
                      return { ...prevTicket, perks: updatedPerks } as TicketType;
                    }
                    return prevTicket;
                  });
                }}
                className={styles.perkNameInput}
              />
              <input
                type='number'
                disabled={!isUserEditorForEvent()}
                placeholder='Perk Count'
                value={perk.count}
                onChange={(e) => {
                  setSelectedTicket((prevTicket) => {
                    if (prevTicket) {
                      const updatedPerks = [...prevTicket.perks];
                      updatedPerks[index].count = Number(e.target.value);
                      return { ...prevTicket, perks: updatedPerks } as TicketType;
                    }
                    return prevTicket;
                  });
                }}
                className={styles.perkCountInput}
              />

              {isUserEditorForEvent() && (
                <MdDelete
                  size={22}
                  color='rgb(147, 149, 151)'
                  onClick={() => {
                    setSelectedTicket((prevTicket) => {
                      if (prevTicket) {
                        const updatedPerks = [...prevTicket.perks];
                        updatedPerks.splice(index, 1);
                        return { ...prevTicket, perks: updatedPerks } as TicketType;
                      }
                      return prevTicket;
                    });
                  }}
                />
              )}
            </div>
          ))}

          {isUserEditorForEvent() && (
            <button
              className={styles.addPerkButton}
              onClick={() => {
                setSelectedTicket((prevTicket) => {
                  if (prevTicket) {
                    const updatedPerks = [...prevTicket.perks];
                    const lastPerk = updatedPerks[updatedPerks.length - 1];
                    if (lastPerk.name && lastPerk.count) {
                      updatedPerks.push({ id: uuidv4(), name: '', count: 1 });
                    } else {
                      toast.error('Please fill the previous perk');
                    }
                    return { ...prevTicket, perks: updatedPerks } as TicketType;
                  }
                  return prevTicket;
                });
              }}
            >
              + Add Perk
            </button>
          )}
        </div>
      )}

      {/* <SelectMultipleDates selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} /> */}

      <button
        className={styles.cancelButton}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        Back
      </button>
    </>
  );
};

export default AdvancedSetting;
