import {
  View,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {makeStyles} from 'react-native-elements';
import {images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {ViewStyle, StyleProp} from 'react-native';
import {BILL_TYPE} from 'models/EBillType';
import {IService} from 'models/IServices';

const useStyles = makeStyles(theme => ({
  mediumText: {
    fontSize: Mixin.moderateSize(12),
    color: '#263238',
    fontWeight: '500',
    textAlign: 'center',
  },
  LargeText: {
    fontSize: Mixin.moderateSize(20),
    color: theme.colors?.white,
    fontWeight: '600',
  },
  container: {
    // alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: 8,
    backgroundColor: theme.colors?.white,
  },
  iconService: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    borderRadius: Mixin.moderateSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewText: {
    width: '90%',
    height: Mixin.moderateSize(30),
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '25%',
    marginBottom: Mixin.moderateSize(5),
    paddingHorizontal: Mixin.moderateSize(5),
  },
  icon: {
    width: Mixin.moderateSize(45),
    height: Mixin.moderateSize(45),
  },
}));
interface IListServiceProps {
  data?: Array<IService>;
  containerStyle?: StyleProp<ViewStyle>;
}
export const ListService = (props: IListServiceProps) => {
  const {t, translations, theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  const gotoScreen = (id: string) => {
    switch (id) {
      case 'transferMoney':
        navigation.navigate('TransferMoney');
        break;
      // case 'Transfer Bank':
      //   navigation.navigate('TransferBank');
      //   break;
      case 'deposit':
        navigation.navigate('CashIn');
        break;
      case 'reCharge':
        navigation.navigate('TopUp');
        break;
      case 'plans':
        navigation.navigate('DataExchange');
        break;
      case 'withDraw':
        navigation.navigate('Withdraw');
        break;
      case 'myQR':
        navigation.navigate('MyQr');
        break;
      case 'postpaid':
        navigation.navigate('Bill', {type: BILL_TYPE.POST_PAID});
        break;
      case 'internet':
        navigation.navigate('Bill', {type: BILL_TYPE.INTERNET});
        break;
      default:
        navigation.navigate('ComingSoon');
        break;
    }
  };
  const getNameService = (id: String) => {
    
    switch (id) {
      case 'transferMoney':
        return t(translations.transfer.transferMoney);
      case 'deposit':
        return t(translations.home.deposit);
      case 'reCharge':
        return t(translations.home.topup);
      case 'plans':
        return t(translations.home.data);
      case 'withDraw':
        return t(translations.withdraw.withdraw);
        // break;
      case 'myQR':
        return t(translations.home.myQR);
      case 'transferBank':
        return t(translations.home.transferBank);
      case 'postpaid':
        return t(translations.paymentService.natcomPostPaid);
      case 'water':
        return t(translations.home.water);
      case 'electricity':
        return t(translations.home.electricity);
      case 'internet':
        return t(translations.paymentService.natcomInternet);
      default:
        return t(translations.home.banking);
    }
  };

  const renderItem = (props: IService) => (
    <TouchableOpacity
      onPress={() => gotoScreen(props.id)}
      style={styles.itemContainer}>
      <View style={styles.iconService}>
        <Image style={styles.icon} source={props.icon} />
      </View>
      <View style={styles.ViewText}>
        <AppText style={styles.mediumText}>{getNameService(props.id)}</AppText>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        style={props.containerStyle}
        data={props.data}
        scrollEnabled={false}
        numColumns={4}
        renderItem={item => renderItem(item.item)}
        keyExtractor={item => item.title}
        extraData={props.data}
      />
    </View>
  );
};
