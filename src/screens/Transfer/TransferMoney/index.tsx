import React, {useEffect, useState, useCallback, useRef} from 'react';
import useStyles from './styles';
import {
  View,
  Image,
  TouchableOpacity,
  ViewProps,
  ScrollView,
} from 'react-native';
import {images} from 'assets';
import _ from 'lodash';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import AppHeader from 'components/modules/Header';
import {CurrencyHelper, HookHelper, Mixin, StringHelper} from 'helpers';
import ListRecent from 'components/modules/ListRecent';
import {useGetTransferInfo} from 'helpers/features/transfer';
import {useCommon} from 'helpers/features/common';
import {ICheckSubResponse} from 'models/services/ITransfer';
import {AccountInput, IAccountInputRef} from 'components/modules/AccountInput';
import {formatAmount} from 'helpers/currencyHelper';
import {FEATURE_CODE} from 'models/EFeatureCode';
import {
  IRecentTrans,
  IMessageInfoTrans,
  IDataIntro,
} from 'models/services/IRecent';
import ValidateRegex from 'models/EValidateRegex';
import {BottomModal} from 'components/atoms/BottomModal';
import {TransactionType} from 'models/TransactionType';
import ModalRecent from 'components/modules/ModalRecent';
import {IntroductionModal} from 'components/modules/IntroductionModal';
import {AuthenticationActions} from 'stores/actions';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import {ScanModal} from 'components/modules/ScanModal';
import {Icon} from 'react-native-elements';

interface IContactDetailProps extends ViewProps {
  avatar: string;
  name: string;
  phoneNumber: string;
  shortName: string;
}
interface IContact {
  title: string;
  description: any;
}
export const TransferMoney = () => {
  const {theme, t, translations, showLoading, hideLoading, dispatch} =
    HookHelper.useBaseHook();

  const {navigation, route} = useGetNavigation<'TransferMoney'>();
  const accountInfo = route.params?.accountInfo;
  const styles = useStyles(theme);
  const [amountString, setAmountString] = useState('');
  const [contentString, setContentString] = useState('');
  const [checkSubData, setCheckSubData] =
    useState<Partial<ICheckSubResponse>>();
  const [phoneNumberAccountString, setPhoneNumberAccountString] = useState(
    accountInfo?.accountNumber || '',
  );
  const accountInputRef = useRef<IAccountInputRef>();
  const [listRecent, setListRecent] = useState<IRecentTrans[]>();
  const [messageInfo, setMessageInfo] = useState<IMessageInfoTrans>();
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageTransaction, setErrorMessageTransaction] = useState('');
  const [showBottomModalIntro, setShowBottomModalIntro] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const [dataIntro, setDataIntro] = useState<IDataIntro[]>();
  const [showScan, setShowScan] = useState(false);
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );

  const scrollRef = useRef<ScrollView>(null);

  const {onGetTransferInfo} = useGetTransferInfo();
  const {onGetListRecent} = useCommon();
  useEffect(() => {
    fetchData().catch(console.error);
    const unsubscribe = navigation.addListener('focus', () => {
      if (!accountInfo) {
        resetData();
      }
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    if (accountInfo) {
      setCheckSubData({
        accountName: accountInfo.accountName,
        accountNumber: accountInfo.accountNumber,
      });
    }
  }, [accountInfo]);
  const fetchData = useCallback(async () => {
    showLoading();
    const response = await onGetListRecent(FEATURE_CODE.TRANSFER_MONEY);
    setListRecent(response?.recentTrans!);
    setMessageInfo(response?.messageInfo!);
    setDataIntro(response?.introduction!);
    hideLoading();

    setTimeout(() => {
      if (
        !authenticationReducer?.isShowIntro?.includes(
          FEATURE_CODE.TRANSFER_MONEY,
        )
      ) {
        setShowBottomModalIntro(true);
      }
    }, 1200);
  }, []);
  const onContinue = async () => {
    showLoading();
    const result = await onGetTransferInfo(
      `${CurrencyHelper.formatPrice(Number(amountString.replace(/\,/g, '')))}`,
      contentString.trim(),
      phoneNumberAccountString.trim(),
    );
    if (!result?.failed) {
      navigation.navigate('ConfirmDetail', {transferData: result?.data!});
    } else {
      setShowBottomModal(true);
      setErrorMessageTransaction(result?.data?.message!);
    }
  };
  const resetData = () => {
    setAmountString('');
    setContentString('');
    setPhoneNumberAccountString('');
    setCheckSubData(undefined);
  };
  const onSelectNumber = (item: IRecentTrans) => {
    onClearData();
    setPhoneNumberAccountString(item?.tplAccountCode);
    setCheckSubData({
      accountName: item.tplName || '',
      accountNumber: item.tplAccountCode || '',
    });
    validateAmount(item?.tplAmount);
    setContentString(item?.tplContent);
    scrollRef.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };
  const setData = (item: IRecentTrans) => {
    setTimeout(() => {
      onSelectNumber(item);
    }, 500);
  };
  const onCheckSub = (item: ICheckSubResponse) => {
    setCheckSubData(item);
  };
  const onClearData = () => {
    setCheckSubData(undefined);
    setPhoneNumberAccountString('');
  };
  const validateAmount = (amount: string) => {
    let numberAmount = amount.replace(ValidateRegex.REMOVE_FIRST_ZERO, '');
    setAmountString(formatAmount(numberAmount.replace(/\,/g, '')));
  };

  const goViewAllRecent = () => {
    navigation.navigate('AllRecentTransaction', {
      featureCode: FEATURE_CODE.TRANSFER_MONEY,
      onSelectItem: item => setData(item),
    });
  };

  // const onClearData = () => {
  //   setPhoneNumberAccountString('');
  // };
  const onPressConfirm = () => {
    setShowBottomModalIntro(false);
    if (hideIntro) {
      const arrScreen = [];
      for (let i = 0; i < authenticationReducer?.isShowIntro.length; i += 1) {
        arrScreen.push(authenticationReducer?.isShowIntro[i]);
      }
      arrScreen.push(FEATURE_CODE.TRANSFER_MONEY);
      dispatch(AuthenticationActions.setShowIntro.request(arrScreen));
    }
  };
  const onHideIntro = (code: boolean) => {
    setHideIntro(code);
  };

  return (
    <>
      <View style={styles.container}>
        <AppHeader filled title={t(translations.transfer.transferMoney)} />
        {messageInfo && !_.isEmpty(messageInfo) ? (
          <View style={styles.titleContainer}>
            <Image
              style={{width: 20, height: 20, marginHorizontal: 10}}
              source={images.IconDiscount}></Image>
            <AppText style={styles.txtTitle}>
              {messageInfo?.messageContent}
            </AppText>
          </View>
        ) : null}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{paddingBottom: Mixin.moderateSize(40)}}
          style={styles.inputContainer}>
          <AccountInput
            needCheckSub
            ref={ref => {
              if (ref) {
                accountInputRef.current = ref;
              }
            }}
            onCheckSubResult={onCheckSub}
            dataCheckSub={checkSubData}
            onClear={() => onClearData()}
            accountString={phoneNumberAccountString}
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
            onClearInput={() => onClearData()}
          />
          <AppInput
            label={t(translations.transfer.amount)}
            value={amountString}
            maxLength={10}
            isClear
            containerStyles={{marginVertical: 5}}
            keyboardType="decimal-pad"
            onChangeText={text => validateAmount(text)}
          />
          <AppInput
            label={t(translations.transfer.content)}
            containerStyles={{marginVertical: 5}}
            value={contentString}
            maxLength={100}
            isClear
            keyboardType="default"
            onChangeText={text =>
              setContentString(StringHelper.validateSpecialCharacter(text))
            }
          />
          <View style={styles.RecentView}>
            <AppText style={styles.txtRecent}>
              {t(translations.transfer.recentBeneficiary)}
            </AppText>
            <TouchableOpacity onPress={goViewAllRecent}>
              <AppText style={styles.txtViewALl}>
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
            onPress={() => setShowScan(true)}
            titleStyle={{color: theme.colors?.primary, marginLeft: 8}}
            customBtnStyle={{backgroundColor: '#F2F2F2'}}
            icon={<Icon color={theme.colors?.primary} name="qrcode-scan" />}
            title={t(translations.scanToTransfer)}
          />
          <AppButton
            disabled={
              _.isEmpty(amountString) ||
              _.isEmpty(phoneNumberAccountString) ||
              _.isEmpty(contentString)
            }
            onPress={() => onContinue()}
            shadow
            title={t(translations.transfer.continue)}
          />
        </View>
        <BottomModal
          onConfirm={() => setShowBottomModal(false)}
          isVisible={showBottomModal}
          confirmTitle={t(translations.changePin.tryAgain)}>
          <View style={styles.WarningBalanceContainer}>
            <Image
              style={styles.iconWarning}
              source={images.IconWarning}></Image>
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
          title3={dataIntro?.content[2] || ''}
        />
      </View>
      <ScanModal
        onCancel={() => setShowScan(false)}
        isVisible={showScan}
        onFinish={data => {
          setShowScan(false);
          setCheckSubData(data);
          setPhoneNumberAccountString(data.accountNumber);
          // if (accountInputRef) {
          //   accountInputRef.current?.checkSub(data);
          // }
        }}
      />
    </>
  );
};
