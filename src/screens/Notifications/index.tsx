import React, { useEffect, useRef, useState } from 'react';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import useStyles from './styles';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import AppHeader from 'components/modules/Header';
import { Icon, Image } from 'react-native-elements';
import { images } from 'assets';
import AppText from 'components/atoms/AppText';
import {
  INotification,
  IReadNotificationRequest,
} from 'models/services/INotification';
import { IPaginationResponse } from 'models/services/IPagination';
import NotificationServices from 'services/NotificationServices';
import notifee from '@notifee/react-native';
import moment from 'moment';
import { useLoadingContext } from 'helpers/loadingHelper';
import { EncryptHelper, Mixin } from 'helpers';
import { UserActions } from 'stores/actions';
import NewServices from 'services/NewServices';

interface INotificationItem {
  isLast: boolean;
  item: INotification;
  isRead?: boolean;
  onRead?: (id: number) => void;
}

const NotificationItem = (props: INotificationItem) => {
  const { item, onRead, isRead, isLast } = props;
  const { theme, dispatch } = useBaseHook();
  const styles = useStyles(theme);
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const totalNumberUnread = useAppSelector(
    state => state.UserReducer.totalNumberUnread,
  );
  const { route, navigation } = useGetNavigation<'NotificationItem'>();

  const readNotification = async () => {
    if (item.status === 0) {
      onRead && onRead(item.id);
      const text = `${item.id}${item.refId}`;
      const signature = await EncryptHelper.encryptSha256(
        text,
        authenticationReducer.signatureKey!,
      );
      const params: IReadNotificationRequest = {
        signature,
        id: item.id,
        refId: item.refId,
      };
      const response = await NotificationServices.readNotification(params);
      if (!response.failed && response.succeeded && response.data) {
        dispatch(
          UserActions.setTotalNumberUnread.request(
            totalNumberUnread ? totalNumberUnread - 1 : 0,
          ),
        );
      }
    }
    if (item?.transactionId) {
      if (item?.objType === '2') {
        const response = await NewServices.getPromotionDetail({ id: 1 });
        navigation.navigate('PromotionDetail', {
          promotion: response?.data.newsInfo,
        });
      } else {
        navigation.navigate('TransactionDetail', { dataTransaction: item });
      }
    }

  };
  const getIcon = (type: number) => {
    switch (type) {
      case 1:
        return images.IconTransferMoney;
      case 2:
        return images.IconWithdraw;
      case 3:
        return images.iconData;
      case 4:
        return images.IconTopUp;
      case 5:
        return images.iconServicePayment;
      default:
        return images.logo_home;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => readNotification()}
      style={styles.contentContainer}>
      <View style={styles.viewTopContent}>
        <Image source={getIcon(item.notificationType)} style={styles.img} />
        <View style={styles.titleTopContainer}>
          <AppText style={styles.txtTransactionType}>{item.title}</AppText>
          <AppText style={styles.TIDCode}>
            {moment(item.createTime).format('HH:mm:ss - DD/MM')}
          </AppText>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
          <View
            style={[
              styles.viewUnRead,
              {
                backgroundColor:
                  item.status === 0 && !isRead
                    ? theme.colors?.primary
                    : 'white',
              },
            ]}
          />
          <AppText
            style={[
              styles.reduceMoney,
              // {color: item.amount.includes('+') ? 'green' : 'red'},
            ]}></AppText>
        </View>
      </View>
      <AppText numberOfLines={2} style={styles.contentTransaction}>
        {item.shortContent}
      </AppText>
    </TouchableOpacity>
  );
};
export const Notifications = () => {
  const { t, theme, translations, dispatch } = useBaseHook();
  const { showLoading, hideLoading } = useLoadingContext();
  const totalNumberUnread = useAppSelector(
    state => state.UserReducer.totalNumberUnread,
  );

  const [notifications, setNotifications] =
    useState<IPaginationResponse<INotification>>();
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentType, setCurrentType] = useState('ALL');
  const styles = useStyles(theme);

  const refFlatList = useRef<FlatList>(null);

  const dataService = [
    { name: t(translations.all), code: 'ALL' },
    { name: t(translations.unread), code: 'UNREAD' },
  ];

  useEffect(() => {
    notifee.setBadgeCount(0);
  }, []);

  useEffect(() => {
    getNotifications();
  }, [page, currentType]);

  const getNotifications = async (refreshing = false) => {
    showLoading();
    const response = await NotificationServices.getNotifications(
      refreshing ? 1 : page,
      currentType,
    );
    hideLoading();
    setRefreshing(false);
    if (response?.succeeded && !response.failed && response.data?.messages) {
      setTotalPage(response.data?.messages.totalPages);
      setNotifications(
        !notifications || refreshing
          ? response.data.messages
          : {
            ...notifications,
            results: notifications.results.concat(
              response.data.messages.results,
            ),
          },
      );
    }
  };

  const readAllNotify = async () => {
    showLoading();
    const params = {
      type: currentType,
    };
    const response = await NotificationServices.readAllNotification(params);

    hideLoading();
    if (!response.failed && response.succeeded && response.data) {
      const arrIdReads = notifications?.results.map(elm => elm.id);
      dispatch(UserActions.setTotalNumberUnread.request(0));
      if (currentType === 'ALL') {
        setReadIds(arrIdReads!);
      } else {
        setNotifications(undefined);
      }
    }
  };

  const onRefresh = () => {
    if (page === 1) {
      getNotifications(true);
    } else {
      setPage(1);
    }
    setRefreshing(true);
  };
  const loadMore = () => {
    if (notifications && page < totalPage) {
      setPage(page + 1);
    }
  };

  const changeService = (elm: { name: string; code: string }) => {
    setNotifications(undefined);
    setCurrentType(elm.code);
    setPage(1);
    refFlatList.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderEmptyList = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 200,
      }}>
      <Image
        style={{ width: 100, height: 100 }}
        source={images.icon_transaction_magnify}
      />
      <AppText style={{ fontSize: 16, color: '#848688' }}>
        {t(translations.noNotifications)}
      </AppText>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title={`${t(translations.notifications)} ${totalNumberUnread !== 0 ? `(${totalNumberUnread})` : ''
          }`}
        filled
        renderRight={
          <Icon
            onPress={() => readAllNotify()}
            color={'white'}
            name="playlist-check"
            type="material-community"
          />
        }
      />
      <View style={styles.containerListService}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 8 }}>
          {dataService.map((elm, index: number) => (
            <TouchableOpacity
              onPress={() => changeService(elm)}
              style={[
                styles.viewService,
                {
                  backgroundColor:
                    currentType === elm.code ? '#FFF6E9' : '#F4F4F4',
                },
              ]}
              key={index}>
              <AppText
                subtitle3
                style={{
                  color:
                    currentType === elm.code ? theme.colors?.primary : 'black',
                }}>
                {elm.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.container}>
        <FlatList
          ref={refFlatList}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          data={notifications?.results}
          // extraData={notifications?.results}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadMore()}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{ paddingBottom: Mixin.moderateSize(80) }}
          renderItem={item => (
            <NotificationItem
              onRead={id => setReadIds(readIds.concat([id]))}
              item={item.item}
              isRead={readIds.includes(item.item.id)}
              isLast={
                notifications?.results
                  ? item.index === notifications?.results.length - 1
                  : false
              }
            />
          )}
        />
      </View>
    </View>
  );
};
