import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Image, ScrollView } from 'react-native';
import AppHeader from 'components/modules/Header';
import { CurrencyHelper, HookHelper, Mixin } from 'helpers';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import { useTopUp } from 'helpers/features/topUp';
import _ from 'lodash';
import { styles } from './styles';
import { ICheckSubResponse } from 'models/services/ITransfer';
import { AccountInput } from 'components/modules/AccountInput';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import { useCommon } from 'helpers/features/common';
import { FEATURE_CODE } from 'models/EFeatureCode';
import ListRecent from 'components/modules/ListRecent';
import { IDataAmountResponse, IRecentTrans, IDataIntro } from 'models/services/IRecent';
import ValidateRegex from 'models/EValidateRegex';
import { formatAmount } from 'helpers/currencyHelper';
import { BottomModal } from 'components/atoms/BottomModal';
import { images } from 'assets';
import { useLoadingContext } from 'helpers/loadingHelper';
import { TransactionType } from 'models/TransactionType';
import ModalRecent from 'components/modules/ModalRecent';
import { IntroductionModal } from 'components/modules/IntroductionModal';
import { AuthenticationActions } from 'stores/actions';

export const TopUp = () => {
  const { theme, t, translations, dispatch } = HookHelper.useBaseHook();
  const { showLoading, hideLoading } = useLoadingContext();
  const { navigation, route } = useGetNavigation<'TopUp'>();
  const accountInfo = route.params?.accountInfo;
  const { onCheckTopUp } = useTopUp();
  const { onGetListRecent } = useCommon();
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const [amount, setAmount] = useState('');
  useState<ICheckSubResponse>();
  const [phoneNumberAccountString, setPhoneNumberAccountString] = useState(
    userInfo?.accountNumber,
  );
  const [listRecent, setListRecent] = useState<IRecentTrans[]>([]);

  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageTransaction, setErrorMessageTransaction] = useState('');
  const [dataAmount, setDataAmount] = useState<IDataAmountResponse[]>([]);
  const [showBottomModalIntro, setShowBottomModalIntro] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [dataIntro, setDataIntro] = useState<IDataIntro[]>();

  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const getListRecentData = async () => {
      showLoading();
      const response = await onGetListRecent(FEATURE_CODE.TOP_UP_MONEY);

      setListRecent(response?.recentTrans!);
      setDataAmount(response?.data!);
      setDataIntro(response?.introduction!)

      hideLoading();
      setTimeout(() => {
        if (!authenticationReducer?.isShowIntro?.includes(FEATURE_CODE.TOP_UP_MONEY)) {
          setShowBottomModalIntro(true);
        }
      }, 1200);
    };
    getListRecentData();
  }, []);

  useEffect(() => {
    if (accountInfo) {
      setPhoneNumberAccountString(accountInfo.accountNumber);
    }
  }, [accountInfo]);

  const onSelectNumber = (item: IRecentTrans) => {
    setPhoneNumberAccountString(item?.tplAccountCode);
    validateAmount(item?.tplAmount);
    scrollRef.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };

  const checkTopUp = async () => {
    const response = await onCheckTopUp(
      phoneNumberAccountString!,
      `${CurrencyHelper.formatPrice(Number(amount.replace(/\,/g, '')))}`,
    );
    if (!response?.failed) {
      navigation.navigate('ConfirmTopUp', {
        checkTopUpData: response?.data!,
      });
    } else {
      setShowBottomModal(true);
      setErrorMessageTransaction(response?.data?.message!);
    }
  };

  const validateAmount = (amount: string) => {
    let numberAmount = amount.replace(ValidateRegex.REMOVE_FIRST_ZERO, '');
    setAmount(formatAmount(numberAmount.replace(/\,/g, '')));
  };

  const onClearData = () => {
    setPhoneNumberAccountString('');
  };
  const onPressConfirm = () => {
    setShowBottomModalIntro(false);
    if (hideIntro) {
      const arrScreen = [];
      for (let i = 0; i < authenticationReducer?.isShowIntro.length; i += 1) {
        arrScreen.push(authenticationReducer?.isShowIntro[i]);
      }
      arrScreen.push(FEATURE_CODE.TOP_UP_MONEY);
      dispatch(AuthenticationActions.setShowIntro.request(arrScreen));
    }
  };
  const onHideIntro = (code: boolean) => {
    setHideIntro(code);
  };

  const goViewAllRecent = () => {
    navigation.navigate('AllRecentTransaction', {
      featureCode: FEATURE_CODE.TOP_UP_MONEY,
      onSelectItem: item => setData(item),
    });
  };
  const setData = (item: IRecentTrans) => {
    setTimeout(() => {
      onSelectNumber(item)
    }, 500);
  }

  return (
    <View style={styles.container}>
      <AppHeader title={t(translations.topUp.topUp)} filled />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: Mixin.moderateSize(40) }}
        style={styles.contentContainer}>
        <AccountInput
          onClearInput={() => onClearData()}
          accountString={phoneNumberAccountString || ''}
          onBlur={() => {
            if (phoneNumberAccountString!.length < 11) {
              setPhoneNumberAccountString('509' + phoneNumberAccountString);
            } else {
              setPhoneNumberAccountString(
                '509' + phoneNumberAccountString!.substring(3),
              );
            }
          }}
          onChangeText={text => setPhoneNumberAccountString(text)}
        />
        <AppInput
          label={t(translations.transfer.amount)}
          value={amount}
          isClear
          containerStyles={{ marginVertical: 5 }}
          keyboardType="decimal-pad"
          onChangeText={text => validateAmount(text)}
        />
        <AppText subtitle2 style={{ marginTop: 16, color: '#545456' }}>
          {t(translations.topUp.chooseAmount)}
        </AppText>
        <View style={styles.amountListContainer}>
          {dataAmount.map((elm: { amount: string }, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => validateAmount(elm.amount)}
                style={[
                  styles.btnAmount,
                  {
                    backgroundColor:
                      amount === elm.amount
                        ? theme.colors?.primary
                        : theme.colors?.backgroundItem,
                  },
                ]}>
                <AppText
                  style={{
                    fontWeight: 'bold',
                    color: amount === elm.amount ? 'white' : '#545456',
                  }}>
                  {formatAmount(elm.amount)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.recentContainer}>
          <AppText subtitle2 style={{ color: '#545456' }}>
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
          disabled={_.isEmpty(amount) || _.isEmpty(phoneNumberAccountString)}
          onPress={() => checkTopUp()}
          shadow
          title={t(translations.transfer.continue)}
        />
      </View>
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageTransaction}</AppText>
        </View>
      </BottomModal>
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
