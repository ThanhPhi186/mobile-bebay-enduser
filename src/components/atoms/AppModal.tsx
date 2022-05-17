import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {makeStyles, OverlayProps} from 'react-native-elements';
import {Overlay} from 'react-native-elements/dist/overlay/Overlay';
import AppButton from './Button';

interface IBottomModal extends OverlayProps {
  canCancel?: boolean;
  cancelTitle?: string;
  confirmTitle?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  disabledConfirm?: boolean;
  disableButton?: boolean;
  showLoading?: boolean;
}
const useStyles = makeStyles(theme => ({
  buttonContainer: {
    width: '100%',
  },
  overlayStyles: {
    position: 'absolute',
    width: '95%',
    // bottom: Mixin.moderateSize(24),
    padding: 0,
    borderRadius: Mixin.moderateSize(8),
  },
  cancelButton: {
    // marginTop: Mixin.moderateSize(8),
  },
}));
export const AppModal = (props: IBottomModal) => {
  const {theme, t, translations} = useBaseHook();
  const {
    confirmTitle = t(translations.confirm),
    cancelTitle = t(translations.cancel),
  } = props;
  const styles = useStyles(theme);

  return (
    <Overlay
      {...props}
      overlayStyle={[styles.overlayStyles, props.overlayStyle]}>
      <View>
        <View style={{padding: 8}}>{props.children}</View>
        {props?.disableButton ? null : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 8,
            }}>
            <View style={{width: '47%'}}>
              {props.canCancel && (
                <AppButton
                  buttonStyle={styles.cancelButton}
                  title={cancelTitle}
                  onPress={() => props.onCancel && props.onCancel()}
                  cancel
                />
              )}
            </View>
            <View style={{width: '47%'}}>
              <AppButton
                disabled={props.disabledConfirm}
                title={confirmTitle}
                onPress={() => {
                  props.onConfirm && props.onConfirm();
                }}
              />
            </View>
          </View>
        )}
        {props.showLoading && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.42)',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Mixin.moderateSize(8),
            }}
            activeOpacity={1}
            onPress={() => {}}>
            <ActivityIndicator
              size={'large'}
              color={theme.colors?.primary}
              style={{backgroundColor: 'transparent'}}
            />
          </TouchableOpacity>
        )}
      </View>
    </Overlay>
  );
};
