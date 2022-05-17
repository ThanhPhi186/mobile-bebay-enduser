import React, {useEffect, useState} from 'react';
import useStyles from './styles';
import {Alert, View, Image, TouchableOpacity} from 'react-native';
import {images} from 'assets';
import {useNavigation} from '@react-navigation/core';
import AppInput from 'components/atoms/AppInput';
import AppText from 'components/atoms/AppText';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import {useDispatch} from 'react-redux';
import AppHeader from 'components/modules/Header';
import {AuthenticationActions} from 'stores/actions';
import {HookHelper, Mixin} from 'helpers';
import ContactDetail from 'components/modules/ContactDetail';
import {ListRecent} from 'components/modules/ListRecent';
import {useGetNavigation} from 'helpers/hookHelper';
const data = [
  {
    id: 1,
    title: 'Esther Howard',
    description: '0143566877554411',
  },
  {
    id: 2,
    title: 'Albert Flores',
    description: '0143566877554411',
  },
];
export const TransferBank = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  const [amountString, setAmountString] = useState('');
  const [contentString, setContentString] = useState('');
  const [accountNumberString, setAccountNumberString] = useState('');
  const onOpenContact = () => {
    console.log('1111111');
  };
  return (
    <Container scrollEnabled={true}>
      <AppHeader filled title={t(translations.transfer.transferMoney)} />
      <View style={styles.inputContainer}>
        <ContactDetail
          containerStyles={styles.contactContainer}
          isContact
          rightButton
          title={'choose account'}
          description={'Select...'}
          onPress={() => onOpenContact}
        />
        <AppInput
          label={t(translations.transfer.accountNumber)}
          value={accountNumberString}
          containerStyles={styles.contactContainer}
          keyboardType="number-pad"
          onChangeText={text => setAccountNumberString(text)}
        />
        <AppInput
          label={t(translations.transfer.amount)}
          value={amountString}
          containerStyles={styles.contactContainer}
          keyboardType="number-pad"
          onChangeText={text => setAmountString(text)}
        />
        <AppInput
          label={t(translations.transfer.content)}
          containerStyles={styles.contactContainer}
          value={contentString}
          keyboardType="default"
          onChangeText={text => setContentString(text)}
        />
        <View style={styles.RecentView}>
          <AppText style={styles.txtRecent}>
            {t(translations.transfer.recentBeneficiary)}
          </AppText>
          <TouchableOpacity onPress={() => navigation.navigate('Transaction')}>
            <AppText style={styles.txtViewALl}>
              {t(translations.transfer.viewAll)}
            </AppText>
          </TouchableOpacity>
        </View>
        <ListRecent data={data} />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => navigation.navigate('ConfirmDetail')}
          shadow
          title={t(translations.transfer.continue)}
        />
      </View>
    </Container>
  );
};
