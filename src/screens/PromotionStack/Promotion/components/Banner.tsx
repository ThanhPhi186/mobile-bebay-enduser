import {getImageUrlFromNew} from 'assets';
import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import {INew} from 'models/INew';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';

import {SwiperFlatList} from 'react-native-swiper-flatlist';

interface IBanner {
  news: INew[];
}

export const Banner = (props: IBanner) => {
  const {theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  return (
    <SwiperFlatList
      data={props.news || []}
      contentContainerStyle={{}}
      showPagination
      paginationStyle={{
        bottom: Mixin.moderateSize(-35),
        // backgroundColor: 'red',
      }}
      paginationStyleItem={{
        width: Mixin.moderateSize(4),
        height: Mixin.moderateSize(4),
      }}
      paginationActiveColor={theme.colors?.primary}
      renderItem={item => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PromotionDetail', {promotion: item.item})
            }
            style={{
              borderRadius: Mixin.moderateSize(18),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="cover"
              style={{
                height: Mixin.moderateSize(200),
                width: Mixin.device_width - Mixin.moderateSize(32),
                borderRadius: Mixin.moderateSize(18),
              }}
              source={{uri: getImageUrlFromNew(item.item)}}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
};
