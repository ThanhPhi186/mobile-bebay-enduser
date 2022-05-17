import React, {useEffect, useState} from 'react';

import Header from './components/Header';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import NewServices from 'services/NewServices';
import {INew, INewCategory} from 'models/INew';
import _ from 'lodash';
import RenderHtml from 'react-native-render-html';
import {getAvatarUrlFromNew} from 'assets';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {Mixin} from 'helpers';
import {Banner} from './components/Banner';
import {IPaginationResponse} from 'models/services/IPagination';
import useStyles from './styles';
import AppText from 'components/atoms/AppText';
import {Image} from 'react-native-elements';
import {useLoadingContext} from 'helpers/loadingHelper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';

const Item = (props: {item: INew}) => {
  const {theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <TouchableOpacity
      key={`${props.item.id}_${props.item.title}`}
      onPress={() =>
        navigation.navigate('PromotionDetail', {promotion: props.item})
      }
      style={styles.itemContainer}>
      <Image
        PlaceholderContent={
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator />
          </View>
        }
        resizeMode={'cover'}
        containerStyle={styles.imageItem}
        style={{width: '100%'}}
        source={{uri: getAvatarUrlFromNew(props.item)}}
      />
      <View style={styles.contentItemContainer}>
        <AppText subtitle2>{props.item.title}</AppText>
        <RenderHtml
          contentWidth={
            Mixin.device_width - (Mixin.moderateSize(32) * 3) / 2.5 - 20
          }
          source={{html: props.item.shortContent || ''}}
        />
      </View>
    </TouchableOpacity>
  );
};

export const Promotion = () => {
  const {t, translations, theme} = useBaseHook();
  const {showLoading, hideLoading} = useLoadingContext();
  const route = useRoute();
  const [hotNews, setHotNews] = useState<INew[]>();
  const [news, setNews] = useState<IPaginationResponse<INew>>();
  const [page, setPage] = useState(1);
  const params = route.params as {promotionType?: INewCategory};
  const [promotionType, setPromotionType] = useState<INewCategory>(
    !_.isEmpty(params) && params.promotionType
      ? params.promotionType
      : {
          id: 0,
          title: 'ALL',
        },
  );
  const [promotionTypes, setPromotionTypes] = useState<INewCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const styles = useStyles(theme);
  useEffect(() => {
    if (params && params.promotionType) {
      onSelectType(params.promotionType);
    }
  }, [params]);
  useEffect(() => {
    getNews(page, promotionType.id);
  }, [page]);
  const getNews = async (page: number, type = promotionType?.id) => {
    showLoading();
    const response = await NewServices.getNews(refreshing ? 1 : page, type);
    console.log('ASDASD', response);
    hideLoading();
    setRefreshing(false);
    if (response?.data?.hotNews && page === 1) {
      setHotNews(response.data.hotNews);
      setTotalPage(response.data.data.totalPages);
    }
    if (_.isEmpty(promotionTypes) && page === 1) {
      setPromotionTypes(response.data?.categoryPromotion || []);
    }
    if (response?.data?.data) {
      setNews(
        !news || refreshing || page === 1
          ? response.data.data
          : {
              ...news,
              results: news.results.concat(response.data.data.results),
            },
      );
    }
  };
  const onRefresh = () => {
    if (page === 1) {
      getNews(1);
    } else {
      setPage(1);
    }
    setRefreshing(true);
  };
  const loadMore = () => {
    if (news && page < totalPage) {
      setPage(page + 1);
    }
  };
  const onSelectType = (type: INewCategory) => {
    setPromotionType(type);
    getNews(1, type.id);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors?.primary}}>
      <Header hideBack title={t(translations.promotion.promotion)} />
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <View>
                <View
                  style={{
                    paddingHorizontal: Mixin.moderateSize(16),
                    paddingTop: Mixin.moderateSize(16),
                  }}>
                  <Banner news={hotNews || []} />
                </View>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  style={styles.typesContainer}>
                  {promotionTypes.map(x => {
                    return (
                      <TouchableOpacity
                        key={x.id}
                        onPress={() => onSelectType(x)}
                        style={[
                          styles.typeContainer,
                          promotionType.id === x.id && styles.selectedType,
                        ]}>
                        <AppText
                          style={
                            promotionType.id === x.id &&
                            styles.typeSelectedTitle
                          }
                          subtitle2>
                          {x.title}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            );
          }}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          ListHeaderComponentStyle={{marginBottom: Mixin.moderateSize(24)}}
          data={news?.results}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadMore()}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => `${item.id}`}
          renderItem={item => <Item item={item.item} />}
        />
      </View>
    </SafeAreaView>
  );
};
