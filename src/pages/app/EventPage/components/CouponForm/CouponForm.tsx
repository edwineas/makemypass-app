import React, { useEffect } from 'react';
import { CouponData, DiscountData } from '../../types';
import { EventType, TicketType } from '../../../../../apis/types';
import styles from './CouponForm.module.css';
import { discountedTicketPrice, getIcon } from '../../constants';
import InputFIeld from '../../../../auth/Login/InputFIeld';
import SecondaryButton from '../../../Overview/components/SecondaryButton/SecondaryButton';
import { motion } from 'framer-motion';
import { applyCoupon } from '../../../../../apis/publicpage';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

// ! POSTPONDED: Feature not available in the current version
// * This feature is not available in the current version of the app
/* eslint no-use-before-define: 0 */ // --> OFF

const CouponForm = ({
  ticketInfo,
  setTicketIds,
  ticketIds,
  eventId,
  discount,
  setDiscount,
  setAmount,
  eventData,
  setCoupon,
  coupon,
  setSelectedDate,
  selectedDate,
}: {
  ticketInfo: { [key: string]: TicketType };
  setTicketIds: React.Dispatch<React.SetStateAction<string[]>>;
  ticketIds: string[];
  eventId: string;
  discount: DiscountData;
  setDiscount: React.Dispatch<React.SetStateAction<DiscountData>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  eventData: EventType | undefined;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
  coupon: CouponData;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDate: Date | null;
}) => {
  const [remainingTickets, setRemainingTickets] = React.useState<number>(0);
  const [isTicketsAvailable, setIsTicketsAvailable] = React.useState<boolean>(true);

  const handleDateChange = (date: Date | null) => {
    console.log(date);

    let newDate;
    if (date) newDate = new Date(date);

    if (newDate && eventData) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
      const remainingTicketsL =
        eventData.remaining_tickets[newDate.toISOString().split('T')[0]] ?? 0;

      setRemainingTickets(remainingTicketsL);

      if (remainingTicketsL === 0) setIsTicketsAvailable(false);
      else setIsTicketsAvailable(true);
    }
  };

  useEffect(() => {
    if (eventData && !eventData.remaining_tickets) return;

    if (eventData) console.log(new Date() > new Date(eventData.event_start_date));
    if (eventData?.event_start_date && new Date() > new Date(eventData.event_start_date)) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
      handleDateChange(selectedDate);
    } else {
      if (eventData?.event_start_date) setSelectedDate(eventData?.event_start_date);
      handleDateChange(selectedDate);
    }
  });

  return (
    <>
      {eventData && eventData.remaining_tickets && (
        <div className={styles.selectDateContainer}>
          <p className={styles.ticketTypesTitle}>Select Date</p>
          <p className={styles.eventDescription}>Select a date to register for the event.</p>

          <div className={styles.selectionContainer}>
            <DatePicker
              wrapperClassName={styles.datePicker}
              dateFormat='dd MMM yyyy'
              selected={selectedDate}
              onChange={(date) => handleDateChange(date)}
              minDate={
                eventData.event_start_date ? new Date(eventData.event_start_date) : new Date()
              }
              maxDate={eventData.event_end_date ? new Date(eventData.event_end_date) : new Date()}
            />
          </div>
        </div>
      )}

      {coupon.status && (
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={`${styles.row} ${styles.ticketType}`}
          style={{
            marginTop: '0rem',
            border: discount.discount_value > 0 ? '2px solid #46BF75' : '2px solid #2A3533',
          }}
        >
          <InputFIeld
            name='coupon_code'
            placeholder='Coupon Code'
            id='coupon_code'
            key='coupon_code'
            error={[coupon.error ?? '']}
            onChange={(e) => {
              setCoupon({
                ...coupon,
                error: '',
                value: e.target.value,
              });
            }}
            type='text'
            icon={getIcon('coupon_code')}
            required={true}
            description={coupon.description}
            style={{
              marginTop: '-1rem',
              border: discount.discount_value > 0 ? '2px solid #46BF75' : '2px solid #2A3533',
            }}
          />
          {discount.discount_type && discount.discount_value > 0 && (
            <p
              style={{
                marginTop: '-1.75rem',
              }}
              className={styles.discountText}
            >
              {discount.discount_type.toLowerCase() === 'percentage'
                ? `${discount.discount_value}% discount applied`
                : `${discount.discount_value} ${ticketInfo[Object.keys(ticketInfo)[0]].currency} discount applied`}
            </p>
          )}

          <div>
            <SecondaryButton
              onClick={() => {
                if (coupon.value) applyCoupon(eventId, coupon, setDiscount, setCoupon);
                else {
                  setCoupon({
                    ...coupon,
                    error: 'Please enter a coupon code',
                  });
                }
              }}
              buttonText='Validate Code'
            />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={styles.ticketTypes}
      >
        <div
          style={{
            marginLeft: '8px',
          }}
        >
          <p className={styles.ticketTypesTitle}>Ticket Types</p>
          <p className={styles.eventDescription}>Select a ticket type to register for the event.</p>
        </div>

        {Object.keys(ticketInfo)?.map((ticketType) => (
          <div
            key={ticketType}
            onClick={() => {
              if (eventData && eventData.remaining_tickets && !isTicketsAvailable) {
                toast.error('No tickets available for this date');
                return;
              }

              if (eventData?.select_multi_ticket) {
                let newTicketIds = []; //temporary variable to store new ticket ids for amount updation

                if (ticketIds.includes(ticketInfo[ticketType].id)) {
                  setTicketIds(ticketIds.filter((id) => id !== ticketInfo[ticketType].id));
                  newTicketIds = ticketIds.filter((id) => id !== ticketInfo[ticketType].id);
                } else {
                  setTicketIds([...ticketIds, ticketInfo[ticketType].id]);
                  newTicketIds = [...ticketIds, ticketInfo[ticketType].id];
                }
                if (discount.discount_value > 0) {
                  const amount = newTicketIds.reduce((acc, id) => {
                    return (
                      acc +
                      discountedTicketPrice(
                        Object.values(ticketInfo).filter((ticktype) => ticktype.id === id)[0].price,
                        discount,
                      )
                    );
                  }, 0);
                  setAmount(amount.toString());
                } else {
                  const amount = newTicketIds.reduce((acc, id) => {
                    return (
                      acc +
                      Number(
                        Object.values(ticketInfo).filter((ticktype) => ticktype.id === id)[0].price,
                      )
                    );
                  }, 0);
                  setAmount(amount.toString());
                }
              } else {
                setTicketIds([ticketInfo[ticketType].id]);
                if (discount.discount_value > 0)
                  setAmount(
                    discountedTicketPrice(
                      Number(ticketInfo[ticketType].price),
                      discount,
                    ).toString(),
                  );
                else {
                  setAmount(ticketInfo[ticketType].price.toString());
                }
              }
            }}
            className={styles.ticketType}
            style={{
              border: ticketIds.includes(ticketInfo[ticketType].id)
                ? '2px solid #FFFFFF'
                : '2px solid #2A3533',
            }}
          >
            <div className={styles.passText}>
              {selectedDate && (
                <p className={styles.remainingTickets}>
                  {remainingTickets > 0 ? `${remainingTickets} tickets left` : 'No tickets left'}
                </p>
              )}
              <p className={styles.ticketTypeTitle}>{ticketType?.toUpperCase()}</p>
              <p className={styles.ticketTypeDescription}>{ticketInfo[ticketType].description}</p>
              <div className={styles.perks}>
                {Object.keys(ticketInfo[ticketType].perks)?.map((perk) => (
                  <div key={perk} className={styles.perk}>
                    {perk}: {ticketInfo[ticketType].perks[perk]}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ticketPriceData}>
              {discount.discount_value > 0 && ticketInfo[ticketType].price > 0 && (
                <div className={styles.discountData}>
                  <p className={styles.discountAmount}>
                    {discount.discount_type.toLowerCase() === 'percentage'
                      ? `${discount.discount_value}% off`
                      : `${ticketInfo[ticketType].currency} ${discount.discount_value} off`}
                  </p>
                  <p className={styles.originalPrice}>
                    <del>
                      M.R.P. {ticketInfo[ticketType].currency} {ticketInfo[ticketType].price}
                    </del>
                  </p>
                </div>
              )}
              <div className={styles.priceData}>
                <p className={styles.ticketPrice}>
                  {discountedTicketPrice(Number(ticketInfo[ticketType].price), discount) === 0
                    ? 'FREE'
                    : `${ticketInfo[ticketType].currency} ${discountedTicketPrice(Number(ticketInfo[ticketType].price), discount)}`}
                </p>
                <p className={styles.extraCharges}>
                  {ticketInfo[ticketType].platform_fee_from_user &&
                    Number(ticketInfo[ticketType].price) > 0 &&
                    discountedTicketPrice(Number(ticketInfo[ticketType].price), discount) !== 0 && (
                      <p className={styles.extraCharges}>
                        {ticketInfo[ticketType].platform_fee}% extra charges
                      </p>
                    )}
                </p>
              </div>
            </div>

            <p className={styles.cardText}>{eventData?.title?.toUpperCase()}</p>
          </div>
        ))}
      </motion.div>
    </>
  );
};

export default CouponForm;
