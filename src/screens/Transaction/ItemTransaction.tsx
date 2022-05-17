import AppText from 'components/atoms/AppText';
import { Mixin } from 'helpers';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { images } from 'assets';
import { IListAllTransaction } from 'models/services/ITransaction';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';

const ItemTransaction = ({ item }: any) => {
  const { navigation } = useGetNavigation();

  return (
    <View style={styles.container}>
      <AppText style={styles.txtDay}>
        {moment(item.day, 'YYYYMMDD').format('LL')}
      </AppText>
      {item.transaction.map((item: IListAllTransaction, index: number) => {
        return (
          <TouchableOpacity onPress={() =>  navigation.navigate('TransactionDetail', { dataTransaction: item })} key={index} style={styles.contentContainer}>
            <View style={styles.viewTopContent}>
              <Image source={images.icon_transaction} style={styles.img} />
              <View style={styles.titleTopContainer}>
                <AppText style={styles.txtTransactionType}>
                  {item.transactionName}
                </AppText>
                <AppText style={styles.TIDCode}>
                  TXD: {item.transactionId}
                </AppText>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                <Text style={styles.txtTimeTransaction}>
                  {item.hourCreated}
                </Text>
                <AppText
                  style={[
                    styles.reduceMoney,
                    { color: item.amount.includes('+') ? 'green' : 'red' },
                  ]}>
                  {item.amount}
                </AppText>
              </View>
            </View>
            <View>
              <Text style={styles.contentTransaction}>{item.content}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ItemTransaction;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: Mixin.moderateSize(16),
  },
  txtDay: {
    textAlign: 'center',
    color: '#848688',
    fontSize: Mixin.moderateSize(14),
  },
  contentContainer: {
    backgroundColor: 'white',
    marginTop: 12,
    borderRadius: 16,
  },
  viewTopContent: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 16,
    borderColor: '#EEF0F4',
  },
  img: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  contentTransaction: {
    color: '#848688',
    ...Mixin.padding(8, 16, 8, 16),
    lineHeight: 28,
    fontSize: Mixin.moderateSize(12),
  },
  titleTopContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  txtTransactionType: {
    fontSize: Mixin.moderateSize(14),
    fontWeight: '600',
  },
  TIDCode: {
    color: '#848688',
    fontSize: Mixin.moderateSize(12),
    marginTop: 12,
  },
  txtTimeTransaction: {
    color: '#848688',
    fontSize: Mixin.moderateSize(12),
  },
  reduceMoney: {
    fontSize: 16,
    fontWeight: '600',

    marginTop: 12,
  },
});
