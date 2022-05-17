import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {StyleSheet} from 'react-native';
import {CheckBox, CheckBoxProps} from 'react-native-elements';

const styles = StyleSheet.create({
  text: {
    fontSize: Mixin.moderateSize(14),
    fontWeight: '400',
  },
  container: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
export const AppCheckBox = (props: CheckBoxProps) => {
  const {theme} = useBaseHook();
  return (
    <CheckBox
      checkedIcon={'checkbox-marked'}
      uncheckedIcon={'checkbox-blank-outline'}
      checkedColor={theme.colors?.primary}
      textStyle={styles.text}
      {...props}
      containerStyle={[styles.container, props.containerStyle]}
    />
  );
};
