import {AuthenticationType} from 'expo-local-authentication';
import {Mixin} from 'helpers';
import {useBiometric} from 'helpers/hookHelper';
import React from 'react';
import {Image, makeStyles} from 'react-native-elements';
import {useBaseHook} from '../../helpers/hookHelper';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {images} from 'assets';
import AppText from 'components/atoms/AppText';

interface IBiometricIcon extends TouchableOpacityProps {
  hideName?: boolean;
}

const useStyles = makeStyles(theme => ({
  biometricIcon: {
    height: Mixin.moderateSize(48),
    width: Mixin.moderateSize(48),
  },
  biometricContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Mixin.moderateSize(24),
    marginBottom: Mixin.moderateSize(16),
  },
}));

export const BiometricIcon = (props: IBiometricIcon) => {
  const {authenticationType, biometricName} = useBiometric();
  const {theme} = useBaseHook();
  const styles = useStyles(theme);
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={props.onPress ? 0.5 : 1}
      style={[styles.biometricContainer, props.style]}>
      <Image
        style={styles.biometricIcon}
        source={
          authenticationType === AuthenticationType.FACIAL_RECOGNITION
            ? images.faceId
            : images.touchId
        }
      />
      {!props.hideName && <AppText>{biometricName}</AppText>}
    </TouchableOpacity>
  );
};
