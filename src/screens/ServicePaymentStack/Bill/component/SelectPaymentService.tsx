import { Mixin } from 'helpers';
import { useBaseHook } from 'helpers/hookHelper';
import React, { useState, useEffect } from 'react';
import { ViewProps, StyleProp, ViewStyle } from 'react-native';
import { images } from 'assets';
import { makeStyles, OverlayProps } from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import { Platform, TouchableOpacity, UIManager, View, Image } from 'react-native';

interface IContactDetailProps extends ViewProps {
  title: string;
  description: string;
  isContact?: boolean;
  onPress?: () => void;
  onClear?: () => void;
  rightButton?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
}
const useStyles = makeStyles(theme => ({
  container: {
    ...Mixin.padding(8, 16, 8, 14),
    borderRadius: Mixin.moderateSize(8),
    height: Mixin.moderateSize(60),
    flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: Mixin.moderateSize(5),
    width:'100%'
  },
  leftView: {
    width: '20%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingVertical: Mixin.moderateSize(3),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems:'center'
  },
  centerView: {
    width: '60%',
    padding: Mixin.moderateSize(5),
    justifyContent: 'center',
  },
  rightView: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  changeButton: {
    width: '100%',
    height: Mixin.moderateSize(20),
    borderRadius: Mixin.moderateSize(5),
    backgroundColor: '#00659F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: Mixin.moderateSize(80),
    height: Mixin.moderateSize(60),
  },
  titleTxt: {
    color: '#84888D',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  descriptionTxt: {
    color: theme.colors?.black,
    fontWeight: '600',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  buttonTxt: {
    fontWeight: '700',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  btnContact: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  btnClose: {
    marginHorizontal: Mixin.moderateSize(10),
  },
  closeIcon: {
    width: Mixin.moderateSize(20),
    height: Mixin.moderateSize(20),
  },
})); 
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const SelectPaymentService = (props: IContactDetailProps) => {
  const { theme, t, translations } = useBaseHook();
  const styles = useStyles(theme);

  return (
    <View
      style={[
        styles.container,
        props.containerStyles,
        { backgroundColor: theme.colors?.white },
      ]}>
      <View style={styles.leftView}>
        <Image
          style={styles.icon}
          resizeMode="contain"
          source={images.logoNatcom}
        />
      </View>
      <View style={styles.centerView}>
        <AppText style={styles.descriptionTxt}>{props.title}</AppText>
        <AppText style={styles.titleTxt}>{props.description}</AppText>
      </View>
      {props.rightButton ? (
        <View style={styles.rightView}>
          <TouchableOpacity
            onPress={props.onPress}
            style={styles.changeButton}>
            <AppText style={styles.buttonTxt} white>
              {t(translations.transfer.change)}
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
export default SelectPaymentService;
