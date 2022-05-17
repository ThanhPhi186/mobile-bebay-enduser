import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {makeStyles} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {images} from 'assets';

import {View, Platform, Dimensions} from 'react-native';
import {INew} from 'models/INew';
import _ from 'lodash';
import {ImageType} from 'models/IImage';
import {BASE_API_URL} from 'utils/Const';
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height:
      Platform.OS === 'ios' ? Mixin.moderateSize(120) : Mixin.moderateSize(100),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderRadius: Mixin.moderateSize(10),
  },
}));
const DEVICE_WIDTH = Dimensions.get('window').width;

interface IBannerSliderProps {
  news: INew[];
  isHome?: boolean;
}

const getImagesFromNews = (news: INew[]) => {
  const listImages = news.map(item => {
    const image = _.find(item.images, x => x.imageType === ImageType.BANNER);
    return `${BASE_API_URL}/assets${image?.url}`;
  });
  return listImages;
};
const getHomeImagesFromNews = (news: INew[]) => {
  const listImages = news.map(item => {
    const image = _.find(
      item.images,
      x => x.imageType === ImageType.HOME_BANNER,
    );
    return `${BASE_API_URL}/assets${image?.url}`;
  });
  return listImages;
};

export const BannerSlider = (props: IBannerSliderProps) => {
  const {theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  const onPress = (index: number) => {
    const promotion = props.news[index];
    navigation.navigate('PromotionDetail', {promotion});
  };
  return (
    <View style={styles.container}>
      <SliderBox
        images={
          props.isHome
            ? getHomeImagesFromNews(props.news)
            : getImagesFromNews(props.news)
        }
        sliderBoxHeight={
          Platform.OS === 'ios'
            ? Mixin.moderateSize(120)
            : Mixin.moderateSize(100)
        }
        parentWidth={DEVICE_WIDTH - Mixin.moderateSize(40)}
        onCurrentImagePressed={(index: number) => onPress(index)}
        dotColor="#FFEE58"
        inactiveDotColor="#90A4AE"
        paginationBoxHorizontalPadding={20}
        autoplay
        circleLoop
        ImageComponentStyle={{borderRadius: Mixin.moderateSize(20)}}
      />
    </View>
  );
};
