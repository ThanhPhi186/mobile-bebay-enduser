import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React, {useState, useEffect} from 'react';
import {ViewProps, StyleProp, ViewStyle} from 'react-native';
import {images} from '../../assets';
import {makeStyles, OverlayProps} from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import {Platform, TouchableOpacity, UIManager, View, Image} from 'react-native';
import {Icon} from 'react-native-elements/dist/icons/Icon';

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
    width: '60%',
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
    alignItems: 'center',
    backgroundColor:'white',
    height:Mixin.moderateSize(40),
    width:Mixin.moderateSize(40),
    borderRadius:10,
  },
  btnClose: {
    marginHorizontal: Mixin.moderateSize(10),
    backgroundColor:'white',
    height:Mixin.moderateSize(40),
    width:Mixin.moderateSize(30),
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center'
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
const ContactDetail = (props: IContactDetailProps) => {
  const {theme, t, translations} = useBaseHook();
  const styles = useStyles(theme);

  return (
    <View
      style={[
        styles.container,
        props.containerStyles,
        {backgroundColor: props.isContact ? theme.colors?.backgroundItem : theme.colors?.white},
      ]}>
      <View style={styles.leftView}>
        <Image
          style={styles.iconContact}
          resizeMode="contain"
          source={images.IconProfile}
        />
      </View>
      <View style={styles.centerView}>
        <AppText style={styles.titleTxt}>{props.title}</AppText>
        <AppText style={styles.descriptionTxt}>{props.description}</AppText>
      </View>
      {props.rightButton ? (
        <View style={styles.rightView}>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => props.onClear && props.onClear()}>
            <Image
              resizeMode={'contain'}
              source={images.IconClose}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          {props.isContact ? (
            <TouchableOpacity
              onPress={() => props.onPress && props.onPress()}
              style={styles.btnContact}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={images.IconContact}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={props.onPress}
              style={styles.changeButton}>
              <AppText style={styles.buttonTxt} white>
                {t(translations.transfer.change)}
              </AppText>
            </TouchableOpacity>
          )}
          
        </View>
      ) : null}
    </View>
  );
};
export default ContactDetail;
