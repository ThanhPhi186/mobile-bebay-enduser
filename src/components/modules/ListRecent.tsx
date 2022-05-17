import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {makeStyles} from 'react-native-elements';
import {images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import {ViewStyle, StyleProp} from 'react-native';
import ContactDetail from 'components/modules/ContactDetail';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {IRecentTrans} from 'models/services/IRecent';
// import { TouchableOpacity } from 'react-native-gesture-handler';

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
    // height: Mixin.device_height / 3,
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
  data?: Array<IRecentTrans>;
  containerStyle?: StyleProp<ViewStyle>;
  onSelectItem: (item: IRecentTrans) => void;
}
export const ListRecent = (props: IListContactProps) => {
  const {t, translations, theme} = useBaseHook();
  const styles = useStyles(theme);
  const navigation = useNavigation();

  const onPressItem = (item: IRecentTrans) => {
    props.onSelectItem(item);
  };
  const renderItem = (props: IRecentTrans) => (
    <TouchableOpacity key={Math.random()} onPress={() => onPressItem(props)}>
      <ContactDetail
        containerStyles={styles.contactContainer}
        isContact
        title={props.tplName || 'Natcash'}
        description={props.tplAccountCode}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      {props?.data?.map((elm)=>{
        return(
          renderItem(elm)
        )
      })}
      {/* <FlatList
        style={props.containerStyle}
        data={props.data}
        renderItem={item => renderItem(item.item)}
        keyExtractor={item => `${item.id}`}
        extraData={props.data}
      /> */}
    </View>
  );
};

export default ListRecent;
