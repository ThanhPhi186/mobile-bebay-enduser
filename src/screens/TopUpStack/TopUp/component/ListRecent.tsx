import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {makeStyles} from 'react-native-elements';
import {images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import {ViewStyle, StyleProp} from 'react-native';
import ContactDetail from 'components/modules/ContactDetail';
import {View, FlatList} from 'react-native';
const useStyles = makeStyles(theme => ({
  mediumText: {
    fontSize: Mixin.moderateSize(14),
    color: theme.colors?.white,
    fontWeight: '500',
    textAlign: 'center',
  },
  LargeText: {
    fontSize: Mixin.moderateSize(20),
    color: theme.colors?.white,
    fontWeight: '600',
  },
  container: {
    width: '100%',
  },
  iconService: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    borderRadius: Mixin.moderateSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '25%',
  },
  icon: {
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
  },
  contactContainer: {
    marginVertical: Mixin.moderateSize(5),
    width: '100%',
  },
}));
interface IListContactProps {
  data?: Array<IContact>;
  containerStyle?: StyleProp<ViewStyle>;
}
interface IContact {
  amount: string;
  phone: string;
}
export const ListRecent = (props: IListContactProps) => {
  const {t, translations, theme} = useBaseHook();
  const styles = useStyles(theme);
  const navigation = useNavigation();

  const renderItem = (props: IContact) => (
    <ContactDetail
      containerStyles={styles.contactContainer}
      isContact
      title={props.amount}
      description={props.phone}
    />
  );
  return (
    <View style={styles.container}>
      <FlatList
        style={props.containerStyle}
        data={props.data}
        renderItem={item => renderItem(item.item)}
        keyExtractor={(item, index) => index.toString()}
        extraData={props.data}
      />
    </View>
  );
};
