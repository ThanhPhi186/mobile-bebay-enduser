import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import Header from '../PromotionStack/Promotion/components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {HookHelper, Mixin} from 'helpers';
import {images} from 'assets';
import {Overlay} from 'react-native-elements';
import DateRangePicker from './DateRangePicker';
import ItemTransaction from './ItemTransaction';
import {styles} from './styles';
import {useTransaction} from 'helpers/features/transaction';
import {
  IListAllTransaction,
  ITransactionTypeList,
  ITransProcessCodeGroupInfoList,
} from 'models/services/ITransaction';
import AppText from 'components/atoms/AppText';
import _ from 'lodash';
import {useAppSelector, useGetNavigation} from '../../helpers/hookHelper';
import {BottomModal} from 'components/atoms/BottomModal';

export const Transaction = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {route, navigation} = useGetNavigation<'Transaction'>();
  const {onGetTransactionService, onGetListTransaction} = useTransaction();

  const languageReducer = useAppSelector(state => state.LanguageReducer);

  const transactionType = route?.params?.transactionType;

  const [modalType, setModalType] = useState(false);
  const [modalDate, setModalDate] = useState(false);
  const [listService, setListService] = useState<Array<ITransactionTypeList>>();

  const [selectService, setSelectService] = useState<ITransactionTypeList>();

  const [fromDate, setFromDate] = useState(
    moment().subtract(7, 'days').format('YYYY-MM-DD'),
  );
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transId, setTransId] = useState('');
  const [listTransaction, setListTransaction] =
    useState<Array<{day: string; transaction: IListAllTransaction}>>();

  const [showBottomModal, setShowBottomModal] = useState(false);
  const [errorMessageBottom, setErrorMessageBottom] = useState('');

  const refFlatList = useRef<FlatList>(null);

  const getService = async () => {
    const serviceResponse = await onGetTransactionService();

    setListService(serviceResponse?.data?.transactionTypeList);
    if (transactionType) {
      const service = serviceResponse?.data?.transactionTypeList?.filter(
        elm => elm.value === transactionType,
      );

      setSelectService(service![0]);
    } else {
      setSelectService(serviceResponse?.data?.transactionTypeList![0]);
    }
    setTransId(`${serviceResponse?.data?.transId}`);
  };

  useEffect(() => {
    getService();
  }, []);

  const getListTransaction = async (refreshing = false) => {
    const listTransactionResponse = await onGetListTransaction(
      transId,
      moment(fromDate).format('DD/MM/YYYY'),
      moment(toDate).format('DD/MM/YYYY'),
      `${selectService?.value}`,
      refreshing ? 1 : page,
    );
    setRefreshing(false);
    if (!listTransactionResponse?.failed) {
      const convertResponse = Object.entries(
        listTransactionResponse?.data?.listAllTransaction || {},
      ).map(([key, value]) => {
        return {
          day: key,
          transaction: value,
        };
      });
      const list = _.orderBy(convertResponse, x => x.day, 'desc');

      if (page === 1) {
        setListTransaction(list);
      } else {
        if (!_.isEmpty(list)) {
          setListTransaction(listTransaction?.concat(list));
        } else {
          setCanLoadMore(false);
        }
      }
    } else {
      setTimeout(() => {
        setErrorMessageBottom(listTransactionResponse?.data?.message!);
        setShowBottomModal(true);
        setListTransaction([]);
      }, 200);
    }
  };

  useEffect(() => {
    transId && getListTransaction();
  }, [transId, toDate, fromDate, selectService, page]);

  const onLoadMore = () => {
    if (canLoadMore) {
      setPage(page + 1);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    if (page === 1) {
      getListTransaction(true);
    } else {
      setPage(1);
      setCanLoadMore(true);
    }
  };

  const onSelectType = (elm: ITransactionTypeList) => {
    setModalType(false);
    setSelectService(elm);
    setPage(1);
    setCanLoadMore(true);
    refFlatList.current?.scrollToOffset({animated: true, offset: 0});
  };

  const onSuccessPickerDate = (fromDate: string, toDate: string) => {
    setListTransaction([]);
    setFromDate(fromDate);
    setToDate(toDate);
    setPage(1);
    setCanLoadMore(true);
  };

  const renderHeader = () => {
    return (
      <Header
        hideBack={!_.isEmpty(navigation.getParent()?.getState())}
        title={t(translations.transaction.transaction)}
        // filled
        // placement={'left'}
        rightComponent={
          <TouchableOpacity
            onPress={() => setModalDate(true)}
            style={styles.rightHeaderContainer}>
            <Image source={images.icon_transaction_calendar} />
            <Text style={{color: 'white', marginLeft: 8}}>
              {t(translations.transaction.sortByDate)}
            </Text>
          </TouchableOpacity>
        }
      />
    );
  };

  const renderItem = ({item}: {item: object}) => {
    return <ItemTransaction item={item} />;
  };

  const renderModalType = () => {
    return (
      <Overlay
        isVisible={modalType}
        onBackdropPress={() => setModalType(false)}
        overlayStyle={styles.overlay}>
        <View
          style={{
            ...Mixin.padding(16, 4, 8, 4),
          }}>
          {listService?.map((elm: ITransactionTypeList, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => onSelectType(elm)}
                style={{
                  borderBottomWidth: index !== 4 ? 1 : 0,
                  borderColor: '#F4EEE8',
                }}
                key={index}>
                <Text
                  style={{
                    paddingVertical: 20,
                  }}>
                  {elm.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Overlay>
    );
  };

  const renderModalDateRange = () => {
    return (
      <DateRangePicker
        hideModal={() => setModalDate(false)}
        isVisible={modalDate}
        initialRange={[fromDate, toDate]}
        onSuccess={(fromDate: string, toDate: string) =>
          onSuccessPickerDate(fromDate, toDate)
        }
      />
    );
  };

  const renderEmptyList = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Mixin.moderateSize(160),
      }}>
      <Image source={images.icon_transaction_magnify} />
      <AppText style={{fontSize: 16, color: '#848688'}}>
        {t(translations.transaction.noTransaction)}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={{flex: 1}}>
        <FlatList
          ref={refFlatList}
          ListHeaderComponent={
            <View style={styles.topContentContainer}>
              <TouchableOpacity
                style={styles.txtTypeContainer}
                onPress={() => setModalType(true)}>
                <Text style={styles.txtType}>{selectService?.title}</Text>
                <Icon
                  name="chevron-down"
                  size={24}
                  color={theme.colors?.primary}
                />
              </TouchableOpacity>
              <Text style={{color: 'gray', fontSize: Mixin.moderateSize(14)}}>
                {moment(fromDate).format('LL')} - {moment(toDate).format('LL')}
              </Text>
            </View>
          }
          data={listTransaction}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          onEndReachedThreshold={0.1}
          onEndReached={() => onLoadMore()}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerFlatlist}
          keyboardShouldPersistTaps="handled"
          stickyHeaderIndices={[0]}
        />
      </View>
      {renderModalType()}
      {renderModalDateRange()}
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.WarningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageBottom}</AppText>
        </View>
      </BottomModal>
    </View>
  );
};
