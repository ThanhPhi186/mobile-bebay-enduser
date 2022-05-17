import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import {BottomModal} from 'components/atoms/BottomModal';
import AppButton from 'components/atoms/Button';
import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {View} from 'react-native';
import {Image, makeStyles} from 'react-native-elements';

interface IConfirmModal {
  onCancel: () => void;
  onOk: () => void;
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
    marginTop: Mixin.moderateSize(20),
    marginBottom: Mixin.moderateSize(40),
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

export const ConfirmModal = (props: IConfirmModal) => {
  const {theme, t, translations} = useBaseHook();
  const styles = useStyles(theme);
  return (
    <BottomModal disabledConfirm isVisible={props.isVisible}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <Image source={images.error} style={styles.icon} />
        <AppText style={styles.confirmTitle} h6>
          {t(translations.changePin.confirmTitle)}
        </AppText>
        <View style={styles.buttonContainer}>
          <AppButton
            cancel
            onPress={() => {
              props.onCancel();
            }}
            buttonStyle={styles.buttonConfirm}
            title={t(translations.no)}
          />
          <AppButton
            onPress={() => props.onOk()}
            buttonStyle={styles.buttonConfirm}
            title={t(translations.yes)}
          />
        </View>
      </View>
    </BottomModal>
  );
};
