import { useEffect, useState } from 'react';
import Glance from '../../../components/Glance/Glance';
import Theme from '../../../components/Theme/Theme';
import styles from './Coupon.module.css';
import { createCoupon, editCoupon, listCoupons, updateCouponStatus } from '../../../apis/coupons';
import GenericTable from '../../../components/Table/GenericTable';
import CouponType, { ActivateCouponType, CreateCouponType, CreateCouponTypeError } from './types';
import SecondaryButton from '../Overview/components/SecondaryButton/SecondaryButton';
import Modal from '../../../components/Modal/Modal';
import InputField from '../../auth/Login/InputField';
import { customStyles } from '../EventPage/constants';
import Select from 'react-select';
import { TicketType } from '../../../apis/types';
import { getTickets } from '../../../apis/tickets';
import Slider from '../../../components/SliderButton/Slider';
import { LuPlus } from 'react-icons/lu';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import SelectComponent from '../FormBuilder/SelectComponent';
import { getConditions } from '../FormBuilder/constant';
import toast from 'react-hot-toast';
import { getForm } from '../../../apis/formbuilder';
import { Field } from '../FormBuilder/types';
import EventHeader from '../../../components/EventHeader/EventHeader';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';

const Coupon = () => {
  type CouponModalType = {
    showModal: boolean;
  };

  const couponTypes = [
    {
      value: 'percentage',
      label: 'Percentage',
    },
    {
      value: 'amount',
      label: 'Amount',
    },
  ];

  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData')!);
  const [couponModal, setCouponModal] = useState<CouponModalType>({
    showModal: false,
  });

  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [activateCoupon, setActivateCoupon] = useState<ActivateCouponType>({
    showModal: false,
    active: false,
    description: '',
    isCouponActive: false,
  });
  const [newCouponData, setNewCouponData] = useState<CreateCouponType>({
    code: '',
    value: 0,
    type: 'amount',
    tickets: [],
    description: '',
    is_active: true,
    count: 0,
    conditions: [],
    is_private: false,
    consumed: 0,
  });
  const [couponError, setCouponError] = useState<CreateCouponTypeError>({});
  const [limitDiscountUsage, setLimitDiscountUsage] = useState(newCouponData.count ? true : false);

  useEffect(() => {
    listCoupons(eventId, setCoupons, setActivateCoupon);
    getTickets(eventId, setTickets);
    getForm(eventId, setFormFields);
  }, []);

  useEffect(() => {
    if (newCouponData.count) setLimitDiscountUsage(true);
  }, [newCouponData.count]);

  const getFieldType = (fieldId: string) => {
    const field = formFields.find((f) => f.id === fieldId);
    if (field) {
      return field.type;
    }
    return '';
  };

  return (
    <>
      {activateCoupon && activateCoupon.showModal && (
        <Modal
          title='Active Coupuon'
          onClose={() => {
            setActivateCoupon({ ...activateCoupon, showModal: false });
          }}
        >
          <div className={styles.activateCouponModal}>
            <Slider
              text='Show Coupon Field in Form'
              checked={activateCoupon.active}
              onChange={() => {
                setActivateCoupon({ ...activateCoupon, active: !activateCoupon.active });
              }}
              size='medium'
              labelStyle={{
                marginLeft: '-0.25rem',
              }}
            />
            {activateCoupon.active && (
              <InputField
                type='text'
                name='Field Description'
                id='fieldDescription'
                placeholder='Enter Field Description'
                icon={<></>}
                required={true}
                onChange={(event) => {
                  setActivateCoupon({ ...activateCoupon, description: event.target.value });
                }}
                value={activateCoupon.description}
                description='This description will serve as helper text for the coupon field'
              />
            )}

            <SecondaryButton
              buttonText='Submit'
              onClick={() => {
                updateCouponStatus(eventId, activateCoupon, setActivateCoupon);
              }}
            />
          </div>
        </Modal>
      )}
      <Theme>
        <div className={styles.mainContainer}>
          <EventHeader previousPageNavigate='/events' />
          <Glance tab='coupon' />
          {couponModal.showModal && (
            <Modal
              type='side'
              title='Add New Coupon Code'
              onClose={() => setCouponModal({ showModal: false })}
            >
              <div
                className={styles.couponModal}
                style={{
                  maxWidth: '30rem',
                }}
              >
                <div className={styles.couponCodeInput}>
                  <InputField
                    type='text'
                    name='Coupon Code'
                    id='couponCode'
                    placeholder='Coupon Code'
                    icon={<></>}
                    required={true}
                    onChange={(event) => {
                      setNewCouponData({ ...newCouponData, code: event.target.value });
                    }}
                    value={newCouponData.code}
                    description='Customer must enter this coupon code at checkout'
                    error={couponError.code}
                    disabled={newCouponData.consumed > 0}
                  />

                  <hr className={styles.line} />

                  <>
                    <div
                      style={{
                        marginBottom: '1rem',
                      }}
                    >
                      <p className={styles.fieldHeader}>Applies To</p>
                      <p className={styles.filedDescription}>
                        if no tickets are selected, coupon will apply to all tickets
                      </p>
                      <Select
                        isMulti
                        styles={customStyles}
                        name='colors'
                        className='basic-multi-select'
                        classNamePrefix='select'
                        options={tickets.map((ticket) => {
                          return {
                            value: ticket.id,
                            label: ticket.title,
                          };
                        })}
                        value={newCouponData.tickets.map((ticket) => {
                          return {
                            value: ticket,
                            label: tickets.find((t) => t.id === ticket)?.title,
                          };
                        })}
                        onChange={(options) => {
                          setNewCouponData({
                            ...newCouponData,
                            tickets: options.map((option) => option.value),
                          });
                        }}
                      />
                      {
                        <p className={styles.error}>
                          {couponError.tickets && couponError.tickets[0]}
                        </p>
                      }
                    </div>
                  </>

                  <div className={styles.discountContainer}>
                    <div className={styles.discountValue}>
                      <InputField
                        type='number'
                        name='Discount Value'
                        id='discount'
                        placeholder='Enter Discount Value'
                        icon={<></>}
                        required={true}
                        disabled={newCouponData.consumed > 0}
                        onChange={(event) => {
                          if (
                            newCouponData.type === 'percentage' &&
                            Number(event.target.value) > 100
                          ) {
                            toast.error('Enter a value less than 100');
                            return;
                          } else {
                            const ticketPrices = newCouponData.tickets.map((ticketId) => {
                              const ticket = tickets.find((ticket) => ticket.id === ticketId);
                              return ticket && ticket.price;
                            });

                            let discountGreaterThanTicket = false;

                            ticketPrices.map((ticketPrice) => {
                              if (ticketPrice && ticketPrice < Number(event.target.value)) {
                                toast.error('Discount Amount is Greater than Ticket Price');
                                discountGreaterThanTicket = true;
                              }
                            });

                            if (discountGreaterThanTicket) return;
                          }
                          setNewCouponData({
                            ...newCouponData,
                            value: parseInt(event.target.value),
                          });
                        }}
                        value={newCouponData.value.toString()}
                        error={couponError.value}
                      />
                      <div className={styles.discountSelectContainer}>
                        <Select
                          styles={customStyles}
                          name='colors'
                          className={styles.basicSelect}
                          classNamePrefix='select'
                          isDisabled={newCouponData.consumed > 0}
                          options={couponTypes}
                          value={couponTypes.find((type) => type.value === newCouponData.type)}
                          onChange={(selectedOption) => {
                            if (selectedOption)
                              setNewCouponData({
                                ...newCouponData,
                                type: selectedOption.value as 'percentage' | 'amount',
                              });
                          }}
                        />
                        {couponError.value && <p className={styles.error}>{couponError.value}</p>}
                      </div>
                    </div>
                  </div>

                  <hr className={styles.line} />

                  <InputField
                    type='textarea'
                    name='Description'
                    id='description'
                    placeholder='Write a short description'
                    icon={<></>}
                    required={false}
                    onChange={(event) => {
                      setNewCouponData({ ...newCouponData, description: event.target.value });
                    }}
                    value={newCouponData.description}
                    error={couponError.description}
                  />

                  <hr className={styles.line} />

                  <div className={styles.discountUses}>
                    {/* <p className={styles.fieldHeader}>Maximum Discount Uses</p> */}
                    <Slider
                      checked={limitDiscountUsage}
                      onChange={() => {
                        setLimitDiscountUsage(!limitDiscountUsage);
                        if (!limitDiscountUsage) {
                          setNewCouponData({ ...newCouponData, count: 5 });
                        }
                      }}
                      text='Limit Discount Usage'
                    />
                    {
                      <p className={styles.error}>
                        {couponError.count && limitDiscountUsage && couponError.count[0]}
                      </p>
                    }
                    {limitDiscountUsage && (
                      <div className={styles.limitInput}>
                        <InputField
                          type='text'
                          name='Conditions'
                          id='conditions'
                          placeholder='Enter the limit'
                          icon={<></>}
                          required={true}
                          onChange={(event) => {
                            if (Number(event.target.value) < 0)
                              toast.error('Count cannot be negative');
                            setNewCouponData({
                              ...newCouponData,
                              count: Number(event.target.value),
                            });
                          }}
                          value={newCouponData.count ? newCouponData.count.toString() : '0'}
                          error={couponError.count}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.limitOne}>
                    <Slider
                      checked={newCouponData.is_private}
                      onChange={() => {
                        setNewCouponData({
                          ...newCouponData,
                          is_private: !newCouponData.is_private,
                        });
                      }}
                      text='Show Coupon in Form'
                    />
                    {
                      <p className={styles.error}>
                        {couponError.is_private &&
                          newCouponData.is_private &&
                          couponError.is_private[0]}
                      </p>
                    }
                    <Slider
                      checked={newCouponData.is_active}
                      onChange={() => {
                        setNewCouponData({
                          ...newCouponData,
                          is_active: !newCouponData.is_private,
                        });
                      }}
                      text='Activate Coupon'
                    />
                    {
                      <p className={styles.error}>
                        {couponError.is_active &&
                          newCouponData.is_active &&
                          couponError.is_active[0]}
                      </p>
                    }
                  </div>
                </div>

                {import.meta.env.VITE_CURRENT_ENV == 'dev' && (
                  <>
                    <hr className={styles.line} />
                    <div className={styles.conditions}>
                      <p className={styles.fieldHeader}>Customer Eligiblity</p>
                      <Slider
                        checked={newCouponData.conditions?.length > 0}
                        onChange={() => {
                          if (newCouponData.conditions?.length > 0) newCouponData.conditions = [];
                          else
                            newCouponData.conditions.push({
                              field: '',
                              value: '',
                              operator: '',
                            });

                          setNewCouponData({ ...newCouponData });
                        }}
                        text='Show coupon only when conditions are met'
                      />
                      {newCouponData.conditions?.length >= 0 && (
                        <div className={styles.conditions}>
                          {newCouponData.conditions.map((condition, idx) => (
                            <div className={styles.conditionRow} key={idx}>
                              <p className={styles.when}>{idx === 0 ? 'When' : 'And'}</p>
                              <div className={styles.conditionsSelect}>
                                <SelectComponent
                                  options={
                                    formFields?.length > 0
                                      ? formFields.map((field) => ({
                                          value: field.id,
                                          label: field.title,
                                        }))
                                      : []
                                  }
                                  value={condition.field}
                                  onChange={(option: { value: string; label: string }) => {
                                    if (!option) condition.field = '';
                                    else condition.field = option.value;

                                    setNewCouponData({ ...newCouponData });
                                  }}
                                  isSmall={true}
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
                                  onChange={(option: { value: string; label: string }) => {
                                    if (!option) condition.operator = '';
                                    else condition.operator = option.value;

                                    setNewCouponData({ ...newCouponData });
                                  }}
                                  isSmall={true}
                                />
                                <input
                                  type='text'
                                  placeholder='Enter a Value'
                                  value={condition.value}
                                  onChange={(event) => {
                                    condition.value = event.target.value;

                                    setNewCouponData({ ...newCouponData });
                                  }}
                                />

                                <RiDeleteBinLine
                                  className='pointer'
                                  size={20}
                                  color='#606264'
                                  onClick={() => {
                                    newCouponData.conditions.splice(idx, 1);
                                    setNewCouponData({ ...newCouponData });
                                  }}
                                />

                                <RxDragHandleDots2
                                  style={{
                                    marginLeft: '0.5rem',
                                  }}
                                  size={20}
                                  color='#606264'
                                />

                                <LuPlus
                                  style={{
                                    marginLeft: '0.5rem',
                                  }}
                                  className='pointer'
                                  size={20}
                                  color='#606264'
                                  onClick={() => {
                                    newCouponData.conditions.push({
                                      field: '',
                                      value: '',
                                      operator: '',
                                    });
                                    setNewCouponData({ ...newCouponData });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className={styles.buttons}>
                  <SecondaryButton
                    buttonText='Discard Coupon'
                    onClick={() => {
                      setCouponModal({ showModal: false });
                      setNewCouponData({
                        code: '',
                        value: 0,
                        type: 'amount',
                        tickets: [],
                        description: '',
                        is_active: true,
                        count: 0,
                        conditions: [],
                        is_private: false,
                      });
                    }}
                  />
                  <SecondaryButton
                    buttonText='Save Coupon'
                    onClick={() => {
                      if (newCouponData.id) editCoupon(eventId, newCouponData, setCoupons);
                      else
                        createCoupon(eventId, newCouponData, setCoupons, setCouponError).then(
                          () => {
                            setCouponModal({ showModal: false });
                            setNewCouponData({
                              code: '',
                              value: 0,
                              type: 'amount',
                              tickets: [],
                              description: '',
                              is_active: true,
                              count: 0,
                              conditions: [],
                              is_private: false,
                            });
                          },
                        );
                    }}
                  />
                </div>
              </div>
            </Modal>
          )}
          {coupons?.length > 0 ? (
            <div className={styles.couponListingContainer}>
              <GenericTable
                tableHeading='Coupons'
                tableData={coupons}
                secondaryButton={
                  <div className={styles.secondaryTableButtons}>
                    <SecondaryButton
                      buttonText='+ Add New Coupon Code'
                      onClick={() => {
                        setNewCouponData({
                          code: '',
                          value: 0,
                          type: 'amount',
                          tickets: [],
                          description: '',
                          is_active: true,
                          count: 0,
                          conditions: [],
                          is_private: false,
                        });
                        setCouponModal({ showModal: true });
                      }}
                    />
                    {coupons && coupons.length > 0 && (
                      <SecondaryButton
                        buttonText={
                          activateCoupon.isCouponActive
                            ? 'Coupons are active'
                            : 'Coupons are not active'
                        }
                        onClick={() => {
                          if (setActivateCoupon) {
                            setActivateCoupon({
                              ...activateCoupon,
                              showModal: true,
                            });
                          }
                        }}
                        icon={
                          !activateCoupon.isCouponActive ? (
                            <BiSolidHide size={20} color='#ffffff' />
                          ) : (
                            <BiSolidShow size={20} color='#ffffff' />
                          )
                        }
                        style={
                          !activateCoupon.isCouponActive
                            ? {
                                backgroundColor: '#f04b4b',
                                color: '#ffffff',
                              }
                            : { background: 'rgba(255, 255, 255, 0.08)', color: '#fff' }
                        }
                      />
                    )}
                  </div>
                }
                setNewCouponData={setNewCouponData}
                setCouponModal={setCouponModal}
                setTableData={setCoupons}
              />
            </div>
          ) : (
            <div className={styles.noCoupon}>
              <p className={styles.noCouponText}>No Coupons Available</p>
              <SecondaryButton
                buttonText='+ Add New Coupon Code'
                onClick={() => {
                  setCouponModal({ showModal: true });
                }}
              />
            </div>
          )}
        </div>
      </Theme>
    </>
  );
};

export default Coupon;
