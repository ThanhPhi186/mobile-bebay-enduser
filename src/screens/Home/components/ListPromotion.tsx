import {
  View,
  Platform,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import AppText from 'components/atoms/AppText';
import React from 'react';
import {makeStyles} from 'react-native-elements';
import {getAvatarUrlFromNew, images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import GlobalStyles from 'utils/styles/GlobalStyles';
import {INew} from 'models/INew';
import _ from 'lodash';
import {ImageType} from 'models/IImage';
import {HookHelper, Mixin, StringHelper} from 'helpers';
import {useAppSelector, useGetNavigation} from 'helpers/hookHelper';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // height:300,
    paddingHorizontal: Mixin.moderateSize(20),
    marginTop: Mixin.moderateSize(10),
  },
  promotionImage: {
    width: '100%',
    height: Mixin.moderateSize(130),
    borderTopLeftRadius: Mixin.moderateSize(10),
    borderTopRightRadius: Mixin.moderateSize(10),
  },
  promotionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Mixin.moderateSize(5),
    width: 270,
    paddingHorizontal: Mixin.moderateSize(5),
    marginVertical: Mixin.moderateSize(10),
  },
  promotionBottomView: {
    ...GlobalStyles.shadowGrey,
    backgroundColor: theme.colors?.white,
    borderBottomLeftRadius: Mixin.moderateSize(10),
    borderBottomRightRadius: Mixin.moderateSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: Mixin.moderateSize(5),
    height: Mixin.moderateSize(50),
  },
  mediumText: {
    fontSize: Mixin.moderateSize(14),
    color: theme.colors?.white,
    fontWeight: '500',
    textAlign: 'center',
  },
  LargeText: {
    fontSize: Mixin.moderateSize(16),
    color: theme.colors?.white,
    fontWeight: '600',
  },
  txtViewALl: {
    color: theme.colors?.primary,
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
    fontWeight: '500',
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Mixin.moderateSize(5),
  },
}));
interface IPromotionProps {
  title?: string;
  news: INew[];
  id?: number;
}
export const ItemPromotion = (props: {item: INew}) => {
  const {theme, t, translations, dispatch} = HookHelper.useBaseHook();

  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PromotionDetail', {promotion: props.item})
      }
      style={styles.promotionContainer}>
      <Image
        style={styles.promotionImage}
        source={{uri: getAvatarUrlFromNew(props.item)}}
      />
      <View style={styles.promotionBottomView}>
        <Text numberOfLines={2} style={[styles.mediumText, {color: '#263238'}]}>
          {props.item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ListPromotion = (props: IPromotionProps) => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.LargeText, {color: theme.colors?.black}]}>
          {props.title}
        </Text>
        <TouchableOpacity
          onPress={
            () =>
              navigation.navigate('TabRoute', {
                screen: 'Promotion',
                params: {
                  promotionType: {
                    id: props.id,
                  },
                },
              })
            // navigation.navigate('Transaction', { fromScreen: 'TRANSFER' })
          }>
          <AppText style={styles.txtViewALl}>
            {t(translations.transfer.viewAll)}
          </AppText>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={props.news}
          horizontal
          renderItem={item => <ItemPromotion item={item.item} />}
        />
      </View>
    </View>
  );
};
