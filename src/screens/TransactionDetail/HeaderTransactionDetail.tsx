import { Mixin } from 'helpers';
import { useBaseHook } from 'helpers/hookHelper';
import React, { useState, useEffect } from 'react';
import { ViewProps, StyleProp, ViewStyle } from 'react-native';
import { images } from '../../assets';
import { makeStyles, OverlayProps } from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import { Platform, TouchableOpacity, UIManager, View, Image } from 'react-native';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import SimpleToast from 'react-native-simple-toast';

interface IContactDetailProps extends ViewProps {
  title: string;
  description: number;
  isContact?: boolean;
  amount: string;
  onPress?: () => void;
  onClear?: () => void;
  rightButton?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  icon:any;
}
const useStyles = makeStyles(theme => ({
  container: {
    ...Mixin.padding(8, 16, 8, 14),
    borderRadius: Mixin.moderateSize(8),
    height: Mixin.moderateSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Mixin.moderateSize(5),
  },
  leftView: {
    width: '15%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingVertical: Mixin.moderateSize(3),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  centerView: {
    width: '85%',
    padding: Mixin.moderateSize(5),
    justifyContent: 'center',
  },
  rightView: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  changeButton: {
    width: '100%',
    height: Mixin.moderateSize(25),
    borderRadius: Mixin.moderateSize(5),
    backgroundColor: '#00659F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: Mixin.moderateSize(20),
    height: Mixin.moderateSize(20),
  },
  iconContact: {
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
  },
  titleTxt: {
    color: '#84888D',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  normalTxt: {
    color: '#84888D',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  descriptionTxt: {
    color: theme.colors?.black,
    fontWeight: '600',
    fontSize: Mixin.moderateSize(16),
    marginTop: 0,
  },
  buttonTxt: {
    fontWeight: '700',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  btnContact: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: Mixin.moderateSize(20),
    borderRadius: 10,
    marginLeft: 5,
    marginBottom:3
  },
  btnClose: {
    marginHorizontal: Mixin.moderateSize(10),
    backgroundColor: 'white',
    height: Mixin.moderateSize(40),
    width: Mixin.moderateSize(30),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
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
const HeaderTransactionDetail = (props: IContactDetailProps) => {
  const { theme, t, translations } = useBaseHook();
  const styles = useStyles(theme);
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const onPressCopy = () => {
    SimpleToast.show(`${'Copied'}`, SimpleToast.SHORT);
    Clipboard.setString(`${props.description}`)
  }
  return (
    <View
      style={[
        styles.container,
        props.containerStyles,
        { backgroundColor: props.isContact ? theme.colors?.backgroundItem : theme.colors?.white },
      ]}>
      <View style={styles.leftView}>
        <Image
          style={styles.iconContact}
          resizeMode="contain"
          source={props?.icon}
        />
      </View>
      <View style={styles.centerView}>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
          <AppText numberOfLines={1} style={styles.descriptionTxt}>{props.title}</AppText>
        </View>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
          <AppText style={[styles.normalTxt, {}]}>{`TXD: ${props.description}`}</AppText>
          <TouchableOpacity
            onPress={() => onPressCopy()}
            style={styles.btnContact}>
            <Icon
              name="content-copy"
              size={20}
              color={theme.colors?.black}
            />
          </TouchableOpacity>
          <AppText style={[styles.normalTxt, { position: 'absolute', right: 0, color: props.amount.includes('+') ? 'green' : 'red' , fontWeight: '700',}]}>{props.amount}</AppText>
        </View>

      </View>
    </View>
  );
};
export default HeaderTransactionDetail;
