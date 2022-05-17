import {useBaseHook} from 'helpers/hookHelper';
import React, {useEffect, useRef, useState} from 'react';
import {
  ViewProps,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {makeStyles, OverlayProps} from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import {View} from 'react-native';
import {images} from 'assets';
import {AppModal} from 'components/atoms/AppModal';
import {HookHelper, Mixin} from 'helpers';
import {useGetNavigation} from 'helpers/hookHelper';
import {IOTPInputRef, OTPInput} from 'components/modules/OtpInput';
import {PinCodeInput} from 'components/modules/PinCodeInput';
import PinInput, {IPinInputRef} from 'components/atoms/PinInput';
import {ErrorMessage} from 'components/modules/ErrorMessage';
import _ from 'lodash';
import {useLoadingContext} from 'helpers/loadingHelper';
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: Mixin.device_height / 2,
    backgroundColor: theme.colors?.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: Mixin.moderateSize(20),
    height: Mixin.moderateSize(20),
  },
  closeIcon: {
    width: Mixin.moderateSize(25),
    height: Mixin.moderateSize(25),
  },
  titleContainer: {
    flexDirection: 'row',
    width: '50%',
    padding: 10,
    height: 50,
    alignItems: 'center',
  },
  lockContainer: {
    flexDirection: 'row',
    flex: 1,
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
  },
  otpInput: {
    width: '90%',
    marginVertical: Mixin.moderateSize(5),
  },
  closeContainer: {
    width: '100%',
    height: Mixin.moderateSize(170),
    marginTop: Mixin.moderateSize(-170),
  },
  btnClose: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtClose: {
    fontSize: Mixin.moderateSize(16),
    fontWeight: '400',
    color: theme.colors?.white,
  },
  txtPin: {
    fontSize: Mixin.moderateSize(20),
    fontWeight: '700',
    marginLeft: 5,
  },
  txtQuestion: {
    fontSize: 16,
    fontWeight: '400',
    marginRight: 5,
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  errorContainer: {
    width: '100%',
    height: Mixin.moderateSize(100),
  },
}));

interface IModalOTP {
  canCancel?: boolean;
  cancelTitle?: string;
  confirmTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
  onFinish?: (code: string) => void;
  onPressClose: () => void;
  errorMessage?: string;
}
const ModalPin = (props: IModalOTP) => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const {loading} = useLoadingContext();
  // const [errorMessage, setErrorMessage] = useState<string>();
  const pinInputRef = useRef<IPinInputRef>();

  const onFinishPin = (code: string) => {
    props.onFinish && props.onFinish(code);
  };
  useEffect(() => {
    if (props.showModal) {
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 200);
    }
  }, [props.showModal]);
  return (
    <AppModal
      disableButton
      onConfirm={() => props.onConfirm()}
      onCancel={() => props.onCancel()}
      isVisible={props.showModal}
      cancelTitle={props.cancelTitle}
      confirmTitle={props.confirmTitle}
      onBackdropPress={() => props.onPressClose && props.onPressClose()}
      overlayStyle={{
        borderRadius: Mixin.moderateSize(18),
        paddingVertical: 15,
        bottom: Platform.OS === 'ios' ? Mixin.moderateSize(290) : 10,
      }}
      canCancel>
      <View style={styles.closeContainer}>
        <View style={styles.errorContainer}>
          {props?.errorMessage && !_.isEmpty(props?.errorMessage) ? (
            <ErrorMessage
              errorStyle={{marginTop: 0}}
              message={props?.errorMessage}
            />
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.btnClose}
          onPress={() => props.onPressClose && props.onPressClose()}>
          <Image
            resizeMode={'contain'}
            source={images.IconClose}
            style={styles.closeIcon}
          />
          <AppText style={styles.txtClose}>
            {t(translations.transfer.close)}
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyModal}>
        <View style={styles.topContainer}>
          <View style={styles.titleContainer}>
            <Image
              resizeMode={'contain'}
              source={images.IconLock}
              style={styles.icon}
            />
            <AppText style={styles.txtPin}>{'PIN'}</AppText>
          </View>
          <View style={[styles.titleContainer, {justifyContent: 'flex-end'}]}>
            <AppText style={styles.txtQuestion}>
              {t(translations.transfer.whatThePin)}
            </AppText>
            <Image
              resizeMode={'contain'}
              source={images.IconQuestion}
              style={styles.icon}
            />
          </View>
        </View>
        <PinInput
          ref={ref => {
            if (ref) {
              pinInputRef.current = ref;
            }
          }}
          showLoading={loading}
          onFinish={text => onFinishPin(text)}
        />
      </View>
    </AppModal>
  );
};
export default ModalPin;
