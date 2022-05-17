import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import AppButton from 'components/atoms/Button';
import PinInput, {IPinInputRef} from 'components/atoms/PinInput';
import {ErrorMessage} from 'components/modules/ErrorMessage';
import {ErrorModal} from 'components/modules/ErrorModal';
import AppHeader from 'components/modules/Header';
import ModalOTP from 'components/modules/ModalOTP';
import {useChangePinServices} from 'helpers/features/changePin';
import {useBaseHook} from 'helpers/hookHelper';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Image, Text} from 'react-native-elements';
import {AuthenticationActions} from 'stores/actions';
import {ConfirmModal} from './components/ConfirmModal';
import {SuccessModal} from './components/SuccessModal';
import useStyles from './styles';

export const ChangePin = () => {
  const {theme, t, translations, dispatch} = useBaseHook();
  const {onChangePin, onVerifyChangePin} = useChangePinServices();
  const [oldPin, setOldPin] = useState<string>();
  const [newPin, setNewPin] = useState<string>();
  const [confirmNewPin, setConfirmNewPin] = useState<string>();
  const [nextNewPin, setNextNewPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<{title: string; description?: string}>();
  const [transId, setTransId] = useState<string>();
  const pinInputRef = useRef<IPinInputRef | undefined>();
  const confirmPinRef = useRef<IPinInputRef | undefined>();

  const [otpString, setOtpString] = useState('');

  const styles = useStyles(theme);
  useEffect(() => {
    focus();
  }, [pinInputRef, nextNewPin]);
  const resetPin = () => {
    if (pinInputRef) {
      pinInputRef.current?.reset();
    }
  };
  const focus = () => {
    setTimeout(() => {
      pinInputRef.current?.focus();
    }, 200);
  };
  const tryAgain = () => {
    setOldPin(undefined);
    setNewPin(undefined);
    setConfirmNewPin(undefined);
    setNextNewPin(false);
    setShowError(false);
    setError(undefined);
    resetPin();
    setTransId(undefined);
  };
  const onFinish = (text: string) => {
    if (!oldPin) {
      setOldPin(text);
      // resetPin();
    } else {
      setNewPin(text);
      confirmPinRef.current?.focus();
      // setShowConfirm(true);
    }
  };
  const onFinishConfirmPin = (text: string) => {
    setConfirmNewPin(text);
  };
  const checkConfirm = () => {
    if (!nextNewPin) {
      if (!oldPin) {
        return false;
      }
      return true;
    } else {
      if (!newPin) {
        return false;
      }
      if (checkSamePin()) {
        return false;
      }
      if (!confirmNewPin) {
        return false;
      }
      if (checkUnMatch()) {
        return false;
      }
      return true;
    }
  };
  const onNext = () => {
    if (!nextNewPin) {
      setNextNewPin(true);
      resetPin();
    } else {
      setShowConfirm(true);
    }
  };
  const onConfirm = async () => {
    setShowConfirm(false);
    const response = await onChangePin(oldPin!, newPin!);
    if (response.success) {
      if (response.data?.requireOtp) {
        setShowOtp(true);
        setTransId(response.data.transId);
      }
    } else {
      setError({
        title: t(translations.error),
        description: response.data?.message,
      });
      setShowError(true);
    }
  };
  const onVerify = async () => {
    setShowOtp(false);
    const response = await onVerifyChangePin(otpString, transId!);
    if (response.success) {
      setTimeout(() => {
        setShowSuccess(true);
      }, 100);
      dispatch(AuthenticationActions.setPin.request(newPin!));
    } else {
      setError({
        title: t(translations.error),
        description: response.data?.message,
      });
      setShowError(true);
    }
  };
  const onFinishOtp = async (code: string) => {
    setOtpString(code);
  };
  const checkSamePin = () => {
    return oldPin === newPin && newPin !== undefined;
  };
  const checkUnMatch = () => {
    return confirmNewPin !== newPin;
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppHeader filled title={t(translations.changePin.changePin)} />
        <View style={styles.container}>
          <Image
            resizeMode={'contain'}
            style={styles.image}
            source={images.change_pin_image}
          />
          <View style={styles.titleContainer}>
            <Image
              resizeMode={'contain'}
              source={images.IconLock}
              style={styles.iconLock}
            />
            <AppText subtitle2>
              {t(
                !nextNewPin
                  ? translations.changePin.oldPin
                  : translations.changePin.newPin,
              )}
            </AppText>
          </View>
          <PinInput
            ref={ref => {
              if (ref) {
                pinInputRef.current = ref;
              }
            }}
            style={{width: '100%'}}
            onFinish={text => onFinish(text)}
          />
          {nextNewPin && (
            <>
              <View style={styles.titleContainer}>
                {/* <Image
                  resizeMode={'contain'}
                  source={images.IconLock}
                  style={styles.iconLock}
                /> */}
                <AppText subtitle2>
                  {t(translations.changePin.confirmPin)}
                </AppText>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (confirmPinRef) {
                    confirmPinRef.current?.focus();
                  }
                }}>
                <PinInput
                  ref={ref => {
                    if (ref) {
                      confirmPinRef.current = ref;
                    }
                  }}
                  style={{width: '100%'}}
                  onFinish={text => onFinishConfirmPin(text)}
                />
              </TouchableWithoutFeedback>
            </>
          )}

          {checkSamePin() && (
            <ErrorMessage message={t(translations.changePin.samePin)} />
          )}
          {checkUnMatch() && confirmNewPin && newPin && (
            <ErrorMessage
              message={t(translations.changePin.confirmPinMessage)}
            />
          )}
          <View
            style={{width: '100%', height: 60, backgroundColor: 'transparent'}}
          />
        </View>
        <View style={styles.nextContainer}>
          <AppButton
            onPress={() => onNext()}
            disabled={!checkConfirm()}
            title={t(!nextNewPin ? translations.next : translations.confirm)}
          />
        </View>
        <ConfirmModal
          isVisible={showConfirm}
          onOk={() => onConfirm()}
          onCancel={() => {
            setShowConfirm(false);
            confirmPinRef.current?.reset();
            resetPin();
          }}
        />
        <SuccessModal
          onCancel={() => setShowSuccess(false)}
          isVisible={showSuccess}
        />
        <ErrorModal
          confirmTitle={t(translations.changePin.tryAgain)}
          onConfirm={() => tryAgain()}
          isVisible={showError}
          title={error?.title || ''}
          description={error?.description}
        />
        <ModalOTP
          onConfirm={() => onVerify()}
          onCancel={() => setShowOtp(false)}
          showModal={showOtp}
          onFinish={(code: string) => onFinishOtp(code)}
          cancelTitle={t(translations.cancel)}
          confirmTitle={t(translations.confirm)}
          canCancel={true}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
