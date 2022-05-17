import { useBaseHook } from 'helpers/hookHelper';
import React, { useEffect, useRef, useState } from 'react';
import { ViewProps, TouchableOpacity, Platform } from 'react-native';
import { makeStyles, OverlayProps } from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import { View } from 'react-native';
import { images } from 'assets';
import { AppModal } from 'components/atoms/AppModal';
import { HookHelper, Mixin, StringHelper } from 'helpers';
import { useGetNavigation } from 'helpers/hookHelper';
import { IOTPInputRef, OTPInput } from 'components/modules/OtpInput';
import { ErrorMessage } from 'components/modules/ErrorMessage';
import { Overlay } from 'react-native-elements/dist/overlay/Overlay';
import AppButton from 'components/atoms/Button';
import AppInput from 'components/atoms/AppInput';
import _ from 'lodash';
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
    paddingVertical: 20,
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
  buttonContainer: {
    width: '100%',
  },
  overlayStyles: {
    position: 'absolute',
    width: '95%',
    borderRadius: Mixin.moderateSize(8),
  },
  cancelButton: {
    // marginTop: Mixin.moderateSize(8),
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
  accountInput: {
    marginTop: Mixin.moderateSize(10),
    width: '100%',
    backgroundColor: theme.colors?.backgroundItem,
  },
}));

interface IModalOTP {
  canCancel?: boolean;
  cancelTitle?: string;
  confirmTitle?: string;
  onConfirm: (idNumber: string) => void;
  onCancel: () => void;
  showModal: boolean;
  onSelectType: (typeID: string) => void;
  typeId: any;
}
const ModalOTP = (props: IModalOTP) => {
  const { theme, t, translations } = HookHelper.useBaseHook();
  const { navigation } = useGetNavigation();

  const styles = useStyles(theme);
  const [btnActive, setBtnActive] = useState('Passport');
  const [idNumber, setIdNumber] = useState('');

  const otpRef = useRef<IOTPInputRef>();
  const resend = () => {
    otpRef.current?.reset();
  };
  useEffect(() => {
    if (props.showModal) {
      otpRef.current?.focus();
    }
  }, [props.showModal]);
  const btnChangeType = (title: string) => {
    return (
      <TouchableOpacity
        style={[
          styles.btnChooseDay,
          props.typeId === title && styles.btnChooseDayActive,
        ]}
        onPress={() => props.onSelectType(title)}>
        <AppText style={{ fontWeight: '600' }}>{title}</AppText>
      </TouchableOpacity>
    );
  };
  return (
    <Overlay
      {...props}
      isVisible={props.showModal}
      overlayStyle={[styles.overlayStyles]}>
      <View style={{ justifyContent: 'space-between', paddingVertical: 20 }}>
        <View style={styles.groupBtn}>
          {btnChangeType(t(translations.register.IDNumber))}
          {btnChangeType(t(translations.register.passport))}
        </View>
        <AppInput
          label={props.typeId}
          containerStyles={styles.accountInput}
          value={idNumber}
          alternative
          keyboardType="default"
          onChangeText={text => setIdNumber(StringHelper.validateSpecialCharacter(text.trim()))}
        />
        <View style={{ width: '100%', marginTop: 10 }}>
          <AppButton
            title={props.confirmTitle}
            onPress={() => {
              props.onConfirm && props.onConfirm(idNumber), setIdNumber('')
            }}
          />
        </View>
        <View style={{ width: '100%' }}>
          {props.canCancel && (
            <AppButton
              buttonStyle={styles.cancelButton}
              title={props.cancelTitle}
              onPress={() => { props.onCancel && props.onCancel(), setIdNumber('') }}
              cancel
            />
          )}
        </View>
      </View>
    </Overlay>
  );
};
export default ModalOTP;
