import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React, {useState, useEffect} from 'react';
import {Alert, ViewProps, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Container from '../atoms/Container';
import {useDispatch} from 'react-redux';
import GlobalStyles from '../../utils/styles/GlobalStyles';
import {images} from '../../assets';
import {makeStyles, OverlayProps} from 'react-native-elements';
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  UIManager,
  View,
  Image,
} from 'react-native';
import AppText from 'components/atoms/AppText';
import {translations} from 'utils/i18n';
import {device_height} from 'helpers/Mixin';

interface ITransactionProps extends ViewProps {
  renderHeader: Element;
  renderBody?: Element;
  disableCollapsible?: boolean;
  isDash?: boolean;
  isResult?: boolean;
}
const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: Mixin.moderateSize(5),
    width: '100%',
  },
  item: {
    width: '100%',
    overflow: 'hidden',
    paddingBottom: Mixin.moderateSize(50),
    marginBottom: Mixin.moderateSize(5),
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Mixin.moderateSize(16),
  },
  itemContainer: {
    ...GlobalStyles.shadow,
    width: '100%',
    backgroundColor: theme.colors?.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Mixin.moderateSize(10),
  },
  bottomView: {
    width: '100%',
    height: Mixin.moderateSize(30),
  },
  icon: {
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
  btn: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(50),
    borderRadius: Mixin.moderateSize(15),
    position: 'absolute',
    bottom: -20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  bottomTxt: {
    width: '100%',
    height: Mixin.moderateSize(40),
    position: 'absolute',
    bottom: -70,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tinyIcon: {
    width: Mixin.moderateSize(25),
    height: Mixin.moderateSize(25),
    resizeMode: 'contain',
    marginTop: 5,
  },
  dashContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Mixin.moderateSize(16),
  },
  dash: {
    borderWidth: 0.5,
    borderColor: '#DADADA',
    flex: 1,
  },
}));
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const TransactionInformation = (props: ITransactionProps) => {
  const {theme, t, translations} = useBaseHook();
  const styles = useStyles(theme);
  const [open, setOpen] = useState(false);

  const onPress = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen(!open);
  };

  const renderDash = () => {
    return (
      <View style={styles.dashContainer}>
        {[...Array(30)].map(() => (
          <>
            <View style={{flex: 1}} />
            <View style={styles.dash} />
          </>
        ))}
      </View>
    );
  };

  const Item = () => (
    <View style={GlobalStyles.shadow}>
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <View style={styles.row}>{props.renderHeader}</View>
          {open || props.disableCollapsible ? (
            props.isResult ? (
              <ScrollView
                style={{maxHeight: device_height / 4, width: '100%'}}
                contentContainerStyle={{paddingBottom: Mixin.moderateSize(20)}}>
                <View style={{width: '100%'}}>
                  {props.isDash && renderDash()}
                  {props.renderBody}
                </View>
              </ScrollView>
            ) : (
              <View style={{width: '100%'}}>
                {props.isDash && renderDash()}
                {props.renderBody}
              </View>
            )
          ) : null}
          <View style={styles.bottomView} />
          <Image style={styles.icon} source={images.IconCircle} />
          {!props.disableCollapsible ? (
            <TouchableOpacity onPress={onPress} style={styles.btn}>
              <Image
                style={styles.tinyIcon}
                source={open ? images.IconArrowUp : images.IconArrowDown}
              />
            </TouchableOpacity>
          ) : null}
          {!props.disableCollapsible ? (
            <TouchableOpacity onPress={onPress} style={styles.bottomTxt}>
              <AppText>
                {open
                  ? t(translations.transfer.lessInformation)
                  : t(translations.transfer.moreInformation)}
              </AppText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
  return <Item />;
};
export default TransactionInformation;
