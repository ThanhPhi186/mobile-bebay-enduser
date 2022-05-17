import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import {HookHelper, Mixin} from 'helpers';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Overlay, OverlayProps} from 'react-native-elements';
import moment from 'moment';

const XDate = require('xdate');

interface DateRangePickerProps extends OverlayProps {
  initialRange: any;
  onSuccess: any;
  hideModal: any;
}
interface day {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
}
const DateRangePicker = (props: DateRangePickerProps) => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const [isFromDatePicked, setIsFromDatePicked] = useState(false);
  const [isToDatePicked, setIsToDatePicked] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [btnActive, setBtnActive] = useState<string>(
    t(translations.transaction.lastSevenDay),
  );

  const todayData = [
    moment().format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ];
  const last7DayData = [
    moment().subtract(7, 'days').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ];
  const thisMonthData = [
    moment().subtract(1, 'months').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ];

  useEffect(() => {
    setupInitialRange(props.initialRange);
  }, []);

  const onDayPress = (day: day) => {
    if (!isFromDatePicked || (isFromDatePicked && isToDatePicked)) {
      setupStartMarker(day);
    } else if (!isToDatePicked) {
      let [mMarkedDates, range] = setupMarkedDates(fromDate, day.dateString, {
        ...markedDates,
      });

      if (range >= 0) {
        setIsFromDatePicked(true);
        setIsToDatePicked(true);
        setMarkedDates(mMarkedDates);
        setToDate(day.dateString);
      } else {
        setupStartMarker(day);
      }
    }
  };

  const setupStartMarker = (day: day) => {
    let markedDates = {
      [day.dateString]: {
        startingDay: true,
        color: theme.colors?.primary,
        customContainerStyle: {borderRadius: 8},
        customTextStyle: {fontWeight: 'bold', color: 'white'},
      },
    };
    setIsFromDatePicked(true);
    setIsToDatePicked(false);
    setFromDate(day.dateString);
    setMarkedDates(markedDates);
  };

  const setupMarkedDates = (
    fromDate: string,
    toDate: string,
    markedDates: any,
  ) => {
    let mFromDate = new XDate(fromDate);
    let mToDate = new XDate(toDate);
    let range = mFromDate.diffDays(mToDate);
    if (range >= 0) {
      if (range == 0) {
        markedDates = {
          [toDate]: {
            color: theme.colors?.primary,
            textColor: 'white',
          },
        };
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd');
          if (i < range) {
            markedDates[tempDate] = {
              color: '#FFF6E9',
              textColor: 'black',
              customTextStyle: {fontWeight: 'bold'},
            };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: theme.colors?.primary,
              customTextStyle: {fontWeight: 'bold', color: 'white'},
              customContainerStyle: {borderRadius: 8},
            };
          }
        }
      }
    }
    return [markedDates, range];
  };

  const setupInitialRange = (dateRange: any) => {
    let [fromDate, toDate] = dateRange;
    let markedDates = {
      [fromDate]: {
        startingDay: true,
        color: theme.colors?.primary,
        customContainerStyle: {borderRadius: 8},
        customTextStyle: {fontWeight: 'bold', color: 'white'},
      },
    };
    let [mMarkedDates, range] = setupMarkedDates(fromDate, toDate, markedDates);
    setMarkedDates(mMarkedDates);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const setCustomDate = (title: string) => {
    setBtnActive(title);
    switch (title) {
      case t(translations.transaction.today):
        setupInitialRange(todayData);
        break;
      case t(translations.transaction.lastSevenDay):
        setupInitialRange(last7DayData);
        break;
      case t(translations.transaction.thisMonth):
        setupInitialRange(thisMonthData);
        break;
      default:
        break;
    }
  };

  const btnDateRange = (title: string) => {
    return (
      <TouchableOpacity
        style={[
          styles.btnChooseDay,
          btnActive === title && styles.btnChooseDayActive,
        ]}
        onPress={() => setCustomDate(title)}>
        <AppText style={{fontWeight: '600'}}>{title}</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={styles.overlayDate}
      onBackdropPress={props.hideModal}>
      <View style={styles.groupBtn}>
        {btnDateRange(t(translations.transaction.today))}
        {btnDateRange(t(translations.transaction.lastSevenDay))}
        {btnDateRange(t(translations.transaction.thisMonth))}
      </View>
      <Calendar
        markingType={'period'}
        current={fromDate}
        markedDates={markedDates}
        onDayPress={day => {
          onDayPress(day);
        }}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <AppButton
          cancel
          buttonStyle={{width: '48%'}}
          title={t(translations.transaction.reset)}
          onPress={() => {
            setupInitialRange(last7DayData);
            setBtnActive(t(translations.transaction.lastSevenDay));
          }}
        />
        <AppButton
          buttonStyle={{width: '48%'}}
          title={t(translations.transaction.done)}
          onPress={() => {
            props.hideModal();
            props.onSuccess(fromDate, toDate);
          }}
        />
      </View>
    </Overlay>
  );
};

export default DateRangePicker;

const styles = StyleSheet.create({
  overlayDate: {
    position: 'absolute',
    width: '95%',
    bottom: 48,
    borderRadius: 8,
    ...Mixin.padding(32, 12, 24, 12),
  },
  groupBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118,118,128,0.12)',
    padding: 2,
    borderRadius: 8,
    marginBottom: 16,
  },
  btnChooseDay: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
  },
  btnChooseDayActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
