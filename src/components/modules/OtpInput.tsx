/* eslint-disable react-hooks/exhaustive-deps */
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import {EncryptHelper, Mixin, StringHelper} from 'helpers';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Keyboard,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {makeStyles} from 'react-native-elements';
import {IAppInputRef} from '../atoms/AppInput';
import BackgroundTimer from 'react-native-background-timer';
import OTPServices from 'services/OTPServices';
import {FEATURE_CODE} from 'models/EFeatureCode';
import {useLoadingContext} from 'helpers/loadingHelper';
const useStyles = makeStyles(theme => ({
  countdownContainer: {
    padding: Mixin.moderateSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  countDown: {
    color: theme.colors?.error,
    fontWeight: '600',
    marginTop: 0,
  },
  containerStyles: {
    marginTop: Mixin.moderateSize(16),
  },
  resend: {
    color: theme.colors?.primary,
    textDecorationLine: 'underline',
  },
}));
interface IOTPInputProps {
  numberOfOTP?: number;
  onFinish?: (otp: string) => void;
  onTimeOut?: () => void;
  onResend?: () => void;
  inputContainerStyle?: StyleProp<ViewStyle>;
  transId?: string;
  hideResend?: boolean;
  featureCode?: FEATURE_CODE;
}
export interface IOTPInputRef {
  reset: () => void;
  focus: () => void;
  resend: () => void;
  clear: () => void;
}

export const OTPInput = forwardRef(
  (props: IOTPInputProps, ref: Ref<IOTPInputRef>) => {
    const {theme, t, translations} = useBaseHook();
    const styles = useStyles(theme);
    const authenticationReducer = useAppSelector(
      state => state.AuthenticationReducer,
    );
    const [loading, setLoading] = useState(false);
    const otpReducer = useAppSelector(state => state.OTPReducer);
    const {numberOfOTP = 6} = props;
    const inputRef = useRef<IAppInputRef>();
    const [timer, setTimer] = useState(59);
    const [otp, setOtp] = useState('');
    useImperativeHandle(ref, () => ({
      reset() {
        reset();
      },
      focus() {
        inputRef.current?.focus();
      },
      resend() {
        resend();
      },
      clear() {
        clear();
      },
    }));
    const clear = () => {
      setOtp('');
    };
    const reset = () => {
      BackgroundTimer.stopBackgroundTimer();
      setOtp('');
      setTimeout(() => {
        setTimer(59);
        startTimer();
      }, 100);
    };
    const startTimer = () => {
      BackgroundTimer.runBackgroundTimer(() => {
        setTimer(secs => {
          if (secs > 0) return secs - 1;
          else return 0;
        });
      }, 1000);
    };
    useEffect(() => {
      if (timer === 0) {
        props.onTimeOut && props.onTimeOut();
        return () => BackgroundTimer.stopBackgroundTimer();
      }
    }, [timer]);
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      startTimer();
      return () => BackgroundTimer.stopBackgroundTimer();
    }, []);

    const onChangeText = (text: string) => {
      setOtp(text);
      if (text.length === numberOfOTP) {
        // Keyboard.dismiss();
        props.onFinish && props.onFinish(text);
      }
    };
    const resend = async () => {
      setLoading(true);
      const signature = await EncryptHelper.encryptSha256(
        `${otpReducer.transId}${otpReducer.featureCode}`,
        authenticationReducer.signatureKey!,
      );
      const response = await OTPServices.resend({
        signature,
        featureCode: otpReducer.featureCode || '',
        transId: otpReducer.transId || '',
      });
      setLoading(false);
      if (response?.succeeded && !response.failed) {
        reset();
        props.onResend && props.onResend();
      }
    };
    return (
      <AppInput
        label="OTP"
        containerStyles={[styles.containerStyles, props?.inputContainerStyle]}
        autoFocus
        value={otp}
        maxLength={6}
        editable={timer !== 0}
        textContentType="oneTimeCode"
        onChangeText={onChangeText}
        keyboardType="number-pad"
        ref={refInput => {
          if (refInput) {
            inputRef.current = refInput;
          }
        }}
        renderRight={
          !props.hideResend && timer === 0 ? (
            <TouchableOpacity
              onPress={() => resend()}
              style={styles.countdownContainer}>
              <AppText subtitle2 style={styles.resend}>
                {t(translations.otp.resend)}
              </AppText>
            </TouchableOpacity>
          ) : (
            <View style={styles.countdownContainer}>
              <AppText subtitle2 style={styles.countDown}>
                {StringHelper.numberToCountdown(timer)}
              </AppText>
            </View>
          )
        }
      />
    );
  },
);
