import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import React, {useEffect, useRef, useState} from 'react';
import {
  ViewProps,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {makeStyles, OverlayProps} from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import {View} from 'react-native';
import {images} from 'assets';
import {AppModal} from 'components/atoms/AppModal';
import {HookHelper, Mixin} from 'helpers';
import {useGetNavigation} from 'helpers/hookHelper';
import {IOTPInputRef, OTPInput} from 'components/modules/OtpInput';
import {ErrorMessage} from 'components/modules/ErrorMessage';
import _ from 'lodash';
import {useLoadingContext} from 'helpers/loadingHelper';
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: Mixin.device_height / 3,
    backgroundColor: theme.colors?.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '50%',
  },
  resend: {
    color: theme.colors?.primary,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
  bodyModal: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  otpInput: {
    width: '90%',
  },
  errorContainer: {
    width: '100%',
    height: Mixin.moderateSize(100),
    justifyContent: 'flex-end',
  },
  closeContainer: {
    width: '100%',
    height: Mixin.moderateSize(100),
    marginTop: Mixin.moderateSize(-120),
  },
}));

interface IModalOTP {
  canCancel?: boolean;
  cancelTitle?: string;
  confirmTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
  onFinish: (code: string) => void;
  errorMessage?: string;
}
const ModalOTP = (props: IModalOTP) => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const otpReducer = useAppSelector(state => state.OTPReducer);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const {loading} = useLoadingContext();
  const styles = useStyles(theme);
  const otpRef = useRef<IOTPInputRef>();
  const resend = () => {
    otpRef.current?.reset();
  };
  useEffect(() => {
    if (props.showModal) {
      setTimeout(() => {
        if (otpRef) {
          otpRef.current?.focus();
        }
      }, 200);
      if (isTimeOut) {
        setIsTimeOut(false);
      }
    }
  }, [props.showModal]);
  return (
    <AppModal
      onConfirm={() => props.onConfirm()}
      onCancel={() => props.onCancel()}
      isVisible={props.showModal}
      onBackdropPress={() => props.onCancel()}
      cancelTitle={props.cancelTitle}
      disabledConfirm={isTimeOut}
      confirmTitle={props.confirmTitle}
      overlayStyle={{
        bottom: Platform.OS === 'ios' ? Mixin.moderateSize(290) : 10,
      }}
      showLoading={loading}
      canCancel>
      <View style={styles.closeContainer}>
        <View style={styles.errorContainer}>
          {props?.errorMessage && !_.isEmpty(props?.errorMessage) ? (
            <ErrorMessage
              errorStyle={{marginTop: 0, alignItems: 'center'}}
              message={props?.errorMessage}
            />
          ) : null}
        </View>
      </View>
      <View style={styles.bodyModal}>
        <AppText style={{marginVertical: 20}} h6>
          {t(translations.transfer.verificationCode)}
        </AppText>
        <AppText caption>
          {!_.isEmpty(otpReducer.otpMessage)
            ? otpReducer.otpMessage
            : t(translations.transfer.pleaseEnterOTP)}
        </AppText>
        <OTPInput
          inputContainerStyle={styles.otpInput}
          ref={ref => {
            if (ref) {
              otpRef.current = ref;
            }
          }}
          onTimeOut={() => setIsTimeOut(true)}
          onResend={() => setIsTimeOut(false)}
          onFinish={code => {
            props.onFinish(code);
          }}
        />
        {/* <TouchableOpacity onPress={() => resend()}>
          <AppText subtitle2 style={styles.resend}>
            {t(translations.otp.resend)}
          </AppText>
        </TouchableOpacity> */}
      </View>
    </AppModal>
  );
};
export default ModalOTP;
