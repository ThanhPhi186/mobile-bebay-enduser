import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import {CheckBox, CheckBoxProps} from 'react-native-elements';
import {padding} from 'helpers/Mixin';
import {images} from 'assets';

const styles = StyleSheet.create({
  text: {
    fontSize: Mixin.moderateSize(14),
    fontWeight: '400',
  },
  container: {
    width: '48%',
    backgroundColor: '#EEF0F4',
    height: '95%',
    borderRadius: 10,
    paddingHorizontal: 5,
    justifyContent: 'space-evenly',
  },
});
interface IPickerDataProps extends ViewProps {
  onPressOpenModal: () => void;
  onSelect?: (text: string) => void;
  title: string;
  content: any;
}
export const ModalPicker = (props: IPickerDataProps) => {
  const {theme} = useBaseHook();
  return (
    <TouchableOpacity
      onPress={() => props.onPressOpenModal && props.onPressOpenModal()}
      style={styles.container}>
      <TouchableOpacity
        onPress={() => props.onPressOpenModal && props.onPressOpenModal()}
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          position: 'absolute',
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          top: 15,
        }}>
        <Image
          style={{width: 30, height: 30}}
          resizeMode={'stretch'}
          source={images.icon_expand_more}></Image>
      </TouchableOpacity>
      <AppText
        style={{
          fontSize: Mixin.moderateSize(12),
          color: '#84888D',
          lineHeight: Mixin.moderateSize(14),
        }}>
        {props.title}
      </AppText>
      <AppText
        style={{
          fontFamily: 'Inter',
          fontWeight: '500',
          fontSize: Mixin.moderateSize(14),
          color: 'black',
        }}>
        {props.content}
      </AppText>
    </TouchableOpacity>
  );
};
