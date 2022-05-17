import {Mixin} from 'helpers';
import _ from 'lodash';
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleProp,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {makeStyles, Text, useTheme} from 'react-native-elements';
import PincodeInput from './PinCodeInput';

interface IOTPInputProps extends ViewProps {
  onFinish: (code: string) => void;
  showLoading?: boolean;
}
export interface IPinInputRef {
  focus: () => void;
  reset: () => void;
}
const useStyles = makeStyles(theme => ({
  inputContainer: {
    ...Mixin.padding(8),
    backgroundColor: theme.colors?.inputAlternative,
    borderRadius: Mixin.moderateSize(14),
    height: Mixin.moderateSize(46),
    width: Mixin.moderateSize(290),
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const PinInput = forwardRef((props: IOTPInputProps, ref: Ref<IPinInputRef>) => {
  const {theme} = useTheme();
  const styles = useStyles(theme);
  const [pin, setPin] = useState('');
  const inputRef = useRef<any>();
  useEffect(() => {
    setPin('');
  }, []);
  const onChange = (text: string) => {
    if (text.length < 4) {
      setPin(text);
    } else if (text.length === 4) {
      setPin(text);
      Keyboard.dismiss();
      setTimeout(() => {
        props.onFinish(text);
      }, 200);
    }
  };
  useImperativeHandle(ref, () => ({
    focus() {
      if (inputRef) {
        inputRef.current?.focus();
      }
    },
    reset() {
      setPin('');
    },
  }));
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (inputRef) {
          inputRef.current?.focus();
        }
      }}
      style={[styles.inputContainer, props.style]}>
      <PincodeInput
        length={4}
        containerStyle={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
        ref={(refA: any) => {
          if (refA) {
            inputRef.current = refA;
          }
        }}
        autoFocus={true}
        circleContainerStyle={{
          paddingHorizontal: Mixin.moderateSize(8),
        }}
        circleEmptyStyle={{
          backgroundColor: theme.colors?.grey1,
        }}
        circleFilledStyle={{
          backgroundColor: theme.colors?.primary,
        }}
        pin={pin}
        onTextChange={(text: string) => onChange(text)}
        onFocus={() => setPin('')}
      />
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
            size={'small'}
            color={theme.colors?.primary}
            style={{backgroundColor: 'transparent'}}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

export default PinInput;
