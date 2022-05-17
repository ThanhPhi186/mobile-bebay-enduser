import React, {useState} from 'react';
import {Mixin} from 'helpers';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import {Button, ButtonProps} from 'react-native-elements';
import GlobalStyles from 'utils/styles/GlobalStyles';
import {theme} from 'utils/styles/theme';

interface IAppButtonProps extends ButtonProps {
  shadow?: boolean;
  disabled?: boolean;
  cancel?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  filled?: boolean;
  customBtnStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: Mixin.moderateSize(44),
    marginTop: Mixin.moderateSize(16),
  },
  button: {
    borderRadius: Mixin.moderateSize(8),
    height: '100%',
    maxHeight: Mixin.moderateSize(100),
  },
  disableButton: {
    backgroundColor: theme.colors?.disabledButton,
  },
  cancelButton: {
    backgroundColor: '#EEF0F4',
  },
  title: {
    fontWeight: '600',
    fontSize: Mixin.moderateSize(14),
  },
  cancelTitle: {
    color: 'black',
  },
  filledContainer: {
    backgroundColor: 'transparent',
  },
  filledTitle: {
    fontWeight: '600',
    fontSize: Mixin.moderateSize(14),
    color: theme.colors?.primary,
  },
});

const AppButton = (props: IAppButtonProps) => {
  const [disable, setDisable] = useState(false);
  const onPress = (event: GestureResponderEvent) => {
    if (!disable) {
      props.onPress && props.onPress(event);
      setDisable(true);
      setTimeout(() => {
        setDisable(false);
      }, 500);
    }
  };
  return (
    <View
      style={[
        styles.buttonContainer,
        props.shadow ? GlobalStyles.shadow : null,
        props.buttonStyle ? props.buttonStyle : null,
      ]}>
      <Button
        disabledTitleStyle={{color: 'white'}}
        disabledStyle={styles.disableButton}
        disabled={props.disabled}
        titleStyle={[
          styles.title,
          props.cancel ? styles.cancelTitle : null,
          props.filled ? styles.filledTitle : null,
        ]}
        {...props}
        onPress={e => onPress(e)}
        buttonStyle={[
          styles.button,
          props.cancel ? styles.cancelButton : null,
          props.filled ? styles.filledContainer : null,
          props.customBtnStyle,
        ]}
      />
    </View>
  );
};
export default AppButton;
