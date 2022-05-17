import {images} from 'assets';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import {HookHelper, StringHelper} from 'helpers';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Image} from 'react-native-elements';
import useStyles from './styles';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';
import RegisterHeader from '../component/Header';
import {BottomModal} from 'components/atoms/BottomModal';
import ModalPassport from '../component/ModalPassport';
import ModalGender from '../component/ModalGender';
import InputPassport from '../component/InputPassport';
import DatePicker from 'react-native-date-picker';
import {ModalPicker} from 'components/modules/ModalPicker';
import {IRegisterConfirmRequest} from 'models/services/IRegister';
import {useRegister} from 'helpers/features/register';
import moment from 'moment';
import ModalOTP from 'components/modules/ModalOTP';
import {ErrorModal} from 'components/modules/ErrorModal';
import _ from 'lodash';

export const Register = () => {
  const {theme, t, translations, dispatch, showLoading, hideLoading} =
    HookHelper.useBaseHook();
  const {navigation, route} = useGetNavigation();
  const styles = useStyles(theme);
  const [phoneNumberString, setPhoneNumberString] = useState('');
  const [fullNameString, setFullNameString] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [transID, setTransID] = useState('');
  const [typeId, setTypeId] = useState(t(translations.register.IDNumber));
  const [typeGender, setTypeGender] = useState(t(translations.register.male));
  const [showModalOTP, setShowModalOTP] = useState(false);
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [date, setDate] = useState(new Date('2007-01-01'));
  const [showBottomModalDate, setShowBottomModalDate] = useState(false);
  const [showBottomModalGender, setShowBottomModalGender] = useState(false);
  const [errorMessageOtp, setErrorMessageOtp] = useState('');
  const {onRegisterConfirm, onRequestOTP} = useRegister();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<{title: string; description?: string}>();
  const [otpString, setOtpString] = useState('');
  const referralNumber = useAppSelector(
    state => state.AuthenticationReducer.referralNumber,
  );
  let dataRegister: IRegisterConfirmRequest;
  const phoneNumber = route.params?.phoneNumber;
  const transId = route.params?.transId;

  useEffect(() => {
    setPhoneNumberString(phoneNumber);
  }, []);
  const onRegister = async () => {
    if (pin !== confirmPin) {
      setTimeout(() => {
        setShowError(true);
        setError({
          title: t(translations.error),
          description: t(translations.register.pinIncorrect),
        });
      }, 200);
      return;
    }
    dataRegister = {
      transId: transId,
      msisdn: phoneNumberString.trim(),
      fullName: fullNameString.trim(),
      dob: moment(date).format('DD/MM/YYYY'),
      gender: typeGender.toString() === t(translations.register.male) ? 0 : 1,
      paperType:
        typeId.toString() === t(translations.register.IDNumber) ? 0 : 1,
      idNo: idNumber.trim(),
      referenceNumber: referralNumber?.trim() || referenceNumber.trim(),
      pin: pin,
    };
    const result = await onRegisterConfirm(dataRegister);
    setTransID(result?.data?.transId);
    if (result?.succeeded && !result.failed) {
      setShowModalOTP(true);
    } else {
      setTimeout(() => {
        setShowError(true);
        setError({
          title: t(translations.error),
          description: result?.data?.message,
        });
      }, 200);
    }
  };
  const tryAgain = () => {
    setShowError(false);
    setError(undefined);
  };
  const onSelectDate = () => {
    setShowBottomModalDate(false);
  };
  const onConfirm = (idNumber: string) => {
    setIdNumber(idNumber);
    setShowBottomModal(false);
    setShowBottomModalGender(false);
  };
  const onCancel = () => {
    setShowModalOTP(false);
    setShowBottomModal(false);
  };
  const onFinishOtp = async (code: string) => {
    setOtpString(code);
  };
  const onConfirmOtp = async () => {
    showLoading();
    try {
      const response = await onRequestOTP(otpString, transID);
      if (response?.succeeded && !response.failed) {
        hideLoading();
        if (response?.succeeded) {
          navigation.navigate('RegisterResult');
          setShowModalOTP(false);
        } else {
          setShowError(true);
          setError({
            title: t(translations.error),
            description: response?.data?.message,
          });
        }
      } else {
        setTimeout(() => {
          setErrorMessageOtp(response?.data?.message);
        }, 200);
      }
    } catch (error) {}
  };
  return (
    <Container scrollEnabled={false}>
      <RegisterHeader filled title={t(translations.register.title)} />
      <View style={styles.container}>
        <AppInput
          label={t(translations.transfer.phoneNumber)}
          containerStyles={styles.accountInput}
          value={phoneNumberString}
          alternative
          editable={false}
          keyboardType="number-pad"
          onBlur={e => {
            if (phoneNumberString.length < 11) {
              setPhoneNumberString('509' + phoneNumberString);
            } else {
              setPhoneNumberString('509' + phoneNumberString.substring(3));
            }
          }}
          onChangeText={text => setPhoneNumberString(text)}
        />
        <AppInput
          label={t(translations.register.fullName)}
          containerStyles={styles.accountInput}
          value={fullNameString}
          maxLength={100}
          alternative
          keyboardType="default"
          onChangeText={text =>
            setFullNameString(StringHelper.validateSpecialCharacter(text))
          }
        />
        <View style={styles.pickerContainer}>
          <ModalPicker
            title={'Date of birth'}
            onPressOpenModal={() => setShowBottomModalDate(true)}
            content={moment(date).format('DD/MM/YYYY')}></ModalPicker>
          <ModalPicker
            title={'Gender'}
            onPressOpenModal={() => setShowBottomModalGender(true)}
            content={typeGender}></ModalPicker>
        </View>
        {idNumber ? (
          <InputPassport
            label={typeId.toString()}
            containerStyles={[
              styles.accountInput,
              {backgroundColor: '#00659F'},
            ]}
            value={idNumber}
            alternative
            keyboardType="default"
            onChangeText={text =>
              setIdNumber(StringHelper.formatString(text.trim()))
            }
          />
        ) : (
          <TouchableOpacity
            onPress={() => setShowBottomModal(true)}
            style={styles.itemPassportContainer}>
            <TouchableOpacity
              onPress={() => setShowBottomModal(true)}
              style={styles.btnChevron}>
              <Image
                style={styles.icon}
                source={images.icon_chevron_right}></Image>
            </TouchableOpacity>
            <AppText style={styles.IDLabel} white>
              {t(translations.register.IDNumberOrPassport)}
            </AppText>
          </TouchableOpacity>
        )}
        <AppInput
          label={t(translations.register.PIN)}
          containerStyles={styles.accountInput}
          value={pin}
          secureTextEntry
          alternative
          maxLength={4}
          keyboardType="number-pad"
          onChangeText={text => setPin(text)}
        />
        <AppInput
          label={t(translations.register.confirmPIN)}
          containerStyles={styles.accountInput}
          value={confirmPin}
          secureTextEntry
          alternative
          maxLength={4}
          keyboardType="number-pad"
          onChangeText={text => setConfirmPin(text)}
        />
        <AppInput
          label={t(translations.register.referenceNumber)}
          containerStyles={styles.accountInput}
          value={referralNumber || referenceNumber}
          alternative
          editable={_.isEmpty(referralNumber)}
          maxLength={20}
          keyboardType="number-pad"
          onChangeText={text => setReferenceNumber(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <AppButton
          disabled={
            _.isEmpty(phoneNumberString.trim()) ||
            _.isEmpty(fullNameString.trim()) ||
            _.isEmpty(idNumber.trim()) ||
            _.isEmpty(pin.trim()) ||
            _.isEmpty(confirmPin.trim())
          }
          shadow
          onPress={() => onRegister()}
          title={t(translations.register.agreeAndContinue)}
        />
      </View>
      <ModalPassport
        onConfirm={idNumber => onConfirm(idNumber)}
        onCancel={() => onCancel()}
        showModal={showBottomModal}
        typeId={typeId}
        onSelectType={typeId => setTypeId(typeId)}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        canCancel={true}
      />
      <BottomModal
        onConfirm={() => onSelectDate()}
        isVisible={showBottomModalDate}
        confirmTitle={t(translations.confirm)}>
        <View
          style={{
            width: '100%',
            height: 220,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 5,
          }}>
          <DatePicker
            maximumDate={new Date('2007-01-01')}
            mode={'date'}
            date={date}
            onDateChange={setDate}
          />
        </View>
      </BottomModal>
      <ModalGender
        onConfirm={idNumber => setShowBottomModalGender(false)}
        onCancel={() => onCancel()}
        showModal={showBottomModalGender}
        typeGender={typeGender}
        onSelectType={typeGender => setTypeGender(typeGender)}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        canCancel={true}
      />
      <ModalOTP
        onConfirm={() => onConfirmOtp()}
        onCancel={() => onCancel()}
        errorMessage={errorMessageOtp}
        showModal={showModalOTP}
        onFinish={(code: string) => onFinishOtp(code)}
        cancelTitle={t(translations.cancel)}
        confirmTitle={t(translations.confirm)}
        canCancel={true}
      />
      <ErrorModal
        confirmTitle={t(translations.changePin.tryAgain)}
        onConfirm={() => tryAgain()}
        isVisible={showError}
        title={error?.title || ''}
        description={error?.description}
      />
    </Container>
  );
};
