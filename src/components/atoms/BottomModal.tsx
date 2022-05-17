import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {View} from 'react-native';
import {makeStyles, OverlayProps} from 'react-native-elements';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import AppButton from './Button';

export interface IBottomModal extends OverlayProps {
  canCancel?: boolean;
  cancelTitle?: string;
  confirmTitle?: string;
  disabledConfirm?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  canDismiss?: boolean;
}
const useStyles = makeStyles(theme => ({
  buttonContainer: {
    width: '100%',
  },
  overlayStyles: {
    position: 'absolute',
    width: '95%',
    bottom: Mixin.moderateSize(24),
    borderRadius: Mixin.moderateSize(8),
  },
  cancelButton: {
    marginTop: Mixin.moderateSize(8),
  },
}));
export const BottomModal = (props: IBottomModal) => {
  const {theme, t, translations} = useBaseHook();
  const {
    confirmTitle = t(translations.confirm),
    cancelTitle = t(translations.cancel),
  } = props;
  const styles = useStyles(theme);

  return (
    <Overlay
      onBackdropPress={() =>
        props.canDismiss && props.onCancel && props.onCancel()
      }
      overlayStyle={styles.overlayStyles}
      {...props}>
      <View>{props.children}</View>
      <View>
        {!props.disabledConfirm && (
          <AppButton
            title={confirmTitle}
            onPress={() => {
              props.onConfirm && props.onConfirm();
            }}
          />
        )}
        {props.canCancel && (
          <AppButton
            buttonStyle={styles.cancelButton}
            title={cancelTitle}
            onPress={() => props.onCancel && props.onCancel()}
            cancel
          />
        )}
      </View>
    </Overlay>
  );
};
