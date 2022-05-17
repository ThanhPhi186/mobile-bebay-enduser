import {useNavigation} from '@react-navigation/native';
import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import {BottomModal} from 'components/atoms/BottomModal';
import AppButton from 'components/atoms/Button';
import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {View} from 'react-native';
import {Image, makeStyles} from 'react-native-elements';

interface ISuccessModal {
  onCancel: () => void;
  isVisible: boolean;
}
const useStyles = makeStyles(theme => ({
  icon: {
    width: Mixin.moderateSize(80),
    height: Mixin.moderateSize(80),
    marginTop: Mixin.moderateSize(30),
  },
  confirmTitle: {
    width: '80%',
    textAlign: 'center',
    marginTop: Mixin.moderateSize(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonConfirm: {
    marginHorizontal: Mixin.moderateSize(4),
    flex: 1,
  },
}));

export const SuccessModal = (props: ISuccessModal) => {
  const {theme, t, translations} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <BottomModal
      onConfirm={() => {
        props.onCancel();
        setTimeout(() => {
          navigation.navigate('TabRoute', {screen: 'Home'});
        }, 100);
      }}
      confirmTitle={t(translations.backToHome)}
      isVisible={props.isVisible}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <Image source={images.checked} style={styles.icon} />
        <AppText style={styles.confirmTitle} h6>
          {t(translations.successTitle)}
        </AppText>
        <AppText style={styles.confirmTitle} caption>
          {t(translations.changePin.successDescription)}
        </AppText>
      </View>
    </BottomModal>
  );
};
