import React, { useEffect, useState, useCallback, useRef } from 'react';
import useStyles from './styles';
import {
  Alert,
  View,
  Image,
  TouchableOpacity,
  ViewProps,
  ScrollView,
} from 'react-native';
import { images } from 'assets';
import { useNavigation } from '@react-navigation/core';
import _ from 'lodash';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import { useDispatch } from 'react-redux';
import AppHeader from 'components/modules/Header';
import { AuthenticationActions } from 'stores/actions';
import { CurrencyHelper, HookHelper, Mixin } from 'helpers';
import ListRecent from 'components/modules/ListRecent';
import { validatePhoneNumber } from 'helpers/stringHelper';
import SelectPaymentService from './component/SelectPaymentService';
import { useBill } from 'helpers/features/bill';
import { ErrorModal } from 'components/modules/ErrorModal';
import { FEATURE_CODE } from 'models/EFeatureCode';
import { useCommon } from 'helpers/features/common';
import { formatAmount } from 'helpers/currencyHelper';
import ValidateRegex from 'models/EValidateRegex';
import { AccountInput } from 'components/modules/AccountInput';
import { IRecentTrans, IDataIntro } from 'models/services/IRecent';
import { IBillResponse } from 'models/services/IBill';
import { BILL_TYPE } from 'models/EBillType';
import { TransactionType } from 'models/TransactionType';
import ModalRecent from 'components/modules/ModalRecent';
import { IntroductionModal } from 'components/modules/IntroductionModal';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';

const getFeatureCodeByBillType = (billType?: BILL_TYPE) => {
  switch (billType) {
    case BILL_TYPE.INTERNET:
      return FEATURE_CODE.BILL_INTERNET;
    default:
      return FEATURE_CODE.BILL_MONEY;
  }
};

export const Bill = () => {
  const { theme, t, translations, showLoading, hideLoading, dispatch } =
    HookHelper.useBaseHook();
  const { navigation, route } = useGetNavigation<'Bill'>();
  const styles = useStyles(theme);
  const [phoneNumberAccountString, setPhoneNumberAccountString] = useState('');
  const [listRecent, setListRecent] = useState<IRecentTrans[]>([]);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<{ title: string; description?: string }>();
  const [isViewAll, setIsViewAll] = useState(false);
  const [visibleModalRecent, setVisibleModalRecent] = useState(false);
  const [showBottomModalIntro, setShowBottomModalIntro] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [dataIntro, setDataIntro] = useState<IDataIntro[]>();

  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const scrollRef = useRef<ScrollView>(null);

  const billType = route.params?.type;
  const { onBillInfo } = useBill();
  const { onGetListRecent } = useCommon();

  const getTitleByBillType = () => {
    switch (billType) {
      case BILL_TYPE.INTERNET:
        return t(translations.paymentService.internetBill);
      default:
        return t(translations.paymentService.postPaidBill);
    }
  };
  const getHeaderByBillType = () => {
    switch (billType) {
      case BILL_TYPE.INTERNET:
        return t(translations.paymentService.natcomInternet);
      default:
        return t(translations.paymentService.natcomPostPaid);
    }
  };

  useEffect(() => {
    fetchData()
      // make sure to catch any error
      .catch(console.error);
    const unsubscribe = navigation.addListener('focus', () => {
      resetData();
    });
    return unsubscribe;
  }, []);
  const fetchData = useCallback(async () => {
    showLoading();
    const response = await onGetListRecent(getFeatureCodeByBillType(billType));
    setListRecent(response?.recentTrans || []);
    setDataIntro(response?.introduction!)

    hideLoading();
    setTimeout(() => {
      if (!authenticationReducer?.isShowIntro?.includes(getTitleByBillType())) {
        setShowBottomModalIntro(true);
      }
    }, 1200);
  }, []);

  const tryAgain = () => {
    setShowError(false);
    setError(undefined);
  };
  const onContinue = async () => {
    showLoading();
    const result = await onBillInfo(phoneNumberAccountString);
    hideLoading();
    if (result?.succeeded && !result.failed) {
      navigation.navigate('BillDebit', {
        transferData: result?.data,
        type: billType,
      });
    } else {
      setError({
        title: t(translations.error),
        description: result?.data?.message,
      });
      setShowError(true);
    }
  };
  const onSelectNumber = (item: IRecentTrans) => {
    setPhoneNumberAccountString(item?.tplAccountCode);
    scrollRef.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };

  const resetData = () => {
    setPhoneNumberAccountString('');
  };
  const onPressConfirm = () => {
    setShowBottomModalIntro(false);
    if (hideIntro) {
      const arrScreen = [];
      for (let i = 0; i < authenticationReducer?.isShowIntro.length; i += 1) {
        arrScreen.push(authenticationReducer?.isShowIntro[i]);
      }
      arrScreen.push(getTitleByBillType());
      dispatch(AuthenticationActions.setShowIntro.request(arrScreen));
    }
  };
  const onHideIntro = (code: boolean) => {
    setHideIntro(code);
  };

  const validatePhone = (amount: string) => {
    let numberAmount = amount.replace(ValidateRegex.REMOVE_FIRST_ZERO, '');
    setPhoneNumberAccountString(formatAmount(numberAmount.replace(/\,/g, '')));
  };
  const checkContinue = () => {
    if (billType === BILL_TYPE.POST_PAID) {
      return validatePhoneNumber(phoneNumberAccountString);
    }
    return !_.isEmpty(phoneNumberAccountString);
  };
  const setData = (item: IRecentTrans) =>{
    setTimeout(() => {
      onSelectNumber(item)
    }, 500);
  }

  const goViewAllRecent = () => {
    navigation.navigate('AllRecentTransaction', {
      featureCode: getFeatureCodeByBillType(billType),
      onSelectItem: item => setData(item),
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader filled title={getHeaderByBillType()} />
      <SelectPaymentService
        isContact
        title={t(translations.paymentService.natcashBillPayment)}
        description={getTitleByBillType()}
      />
      <View style={styles.bottomView}></View>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: Mixin.moderateSize(40) }}
        style={styles.inputContainer}>
        {billType === BILL_TYPE.POST_PAID ? (
          <AccountInput
            accountString={phoneNumberAccountString || ''}
            onChangeText={text => setPhoneNumberAccountString(text)}
            onClearInput={() => resetData()}
          />
        ) : (
          <AppInput
            label={t(translations.transfer.accountNumber)}
            value={phoneNumberAccountString}
            isClear
            onChangeText={text => setPhoneNumberAccountString(text.trim())}
          />
        )}

        <View style={styles.RecentView}>
          <AppText style={styles.txtRecent}>
            {t(translations.transfer.recentBeneficiary)}
          </AppText>
          <TouchableOpacity onPress={goViewAllRecent}>
            <AppText body2 style={{ color: theme.colors?.primary }}>
              {t(translations.transfer.viewAll)}
            </AppText>
          </TouchableOpacity>
        </View>
        <ListRecent
          onSelectItem={onSelectNumber}
          data={_.slice(listRecent, 0, 3)}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <AppButton
          disabled={!checkContinue()}
          onPress={() => onContinue()}
          shadow
          title={t(translations.transfer.continue)}
        />
      </View>
      <ErrorModal
        confirmTitle={t(translations.changePin.tryAgain)}
        onConfirm={() => tryAgain()}
        isVisible={showError}
        title={error?.title || ''}
        description={error?.description}
      />
      <IntroductionModal
        onConfirm={() => onPressConfirm()}
        onHideIntro={code => onHideIntro(code)}
        isVisible={showBottomModalIntro}
        confirmTitle={t(translations.iGotIt)}
        imageUrl={dataIntro?.image || ''}
        title={dataIntro?.title || ''}
        title1={dataIntro?.content[0] || ''}
        title2={dataIntro?.content[1] || ''}
        title3={dataIntro?.content[2] || ''}></IntroductionModal>
    </View>
  );
};
