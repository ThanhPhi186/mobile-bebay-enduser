import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import { useAppSelector, useBaseHook } from 'helpers/hookHelper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Share from 'react-native-share';
import { Icon, Image } from 'react-native-elements';
import InviteServices from 'services/InviteServices';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from './styles';
import AppText from 'components/atoms/AppText';
import { Mixin, StringHelper } from 'helpers';
import QRCode from 'react-native-qrcode-svg';
import Contacts from 'react-native-contacts';
import _ from 'lodash';
import { EInviteType, IInviteInfoRequest } from 'models/services/IInvite';
import { ContactActions } from 'stores/actions';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import { images } from 'assets';
import AppButton from 'components/atoms/Button';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import GlobalStyles from 'utils/styles/GlobalStyles';
import Clipboard from '@react-native-clipboard/clipboard';
import BigList from 'react-native-big-list';
import { Transaction } from 'screens/Transaction';

interface IContact {
  phoneNumber?: string;
  name: string;
}
const convertContact = (contacts: Contacts.Contact[]): IContact[] => {
  if (_.isEmpty(contacts)) {
    return [];
  }
  return contacts.map(x => {
    const contact: IContact = {
      phoneNumber: !_.isEmpty(x.phoneNumbers[0]?.number)
        ? x.phoneNumbers[0].number.replace(/\D/g, '').replace(' ', '')
        : '',
      name: `${x.familyName || ''} ${x.middleName || ''}${x.givenName || ''}`,
    };
    return contact;
  });
};
const formatNumber = (phoneNumberString?: string) => {
  if (!phoneNumberString) {
    return '';
  }
  if (phoneNumberString.length < 11) {
    phoneNumberString = `509${phoneNumberString}`;
  }
  return phoneNumberString;
};

interface IInviteItemProps {
  item: IContact;
  isInvited?: boolean;
  isNatcash?: boolean;
  onShowFlash?: (message: string, type: 'success' | 'danger') => void;
}

const InviteItem = (props: IInviteItemProps) => {
  const { theme, t, translations, dispatch } = useBaseHook();

  const styles = useStyles(theme);
  const [invited, setInvited] = useState(props.isInvited);
  useEffect(() => {
    setInvited(props.isInvited);
  }, [props.isInvited]);


  const onInvite = async () => {
    // if (!StringHelper.validatePhoneNumber(props.item.phoneNumber || '')) {
    //   Alert.alert(
    //     'Error',
    //     `The Contact: ${props.item.name} is invalid. Please check and try again!`,
    //   );
    //   return;
    // }
    setInvited(true);
    const response = await InviteServices.invite({
      msisdnArr: `${props.item.phoneNumber}`,
    });
    if (response.succeeded) {
      if (response.data?.code !== 'MSG_SUCCESS') {
        setInvited(false);
        props.onShowFlash &&
          props.onShowFlash(`${response.data?.message}`, 'danger');
      } else {
        dispatch(ContactActions.invite.request(props.item.phoneNumber || ''));
        props.onShowFlash &&
          props.onShowFlash(
            `You have invited ${props.item.name} successfully `,
            'success',
          );
      }
    }
  };
  return (
    <View style={styles.itemContainer}>
      <View style={styles.avaNameContainer}>
        <Image
          resizeMode="cover"
          source={images.avatar}
          style={styles.avatar}
        />
        <View
          style={{
            marginLeft: Mixin.moderateSize(16),
            justifyContent: 'center',
          }}>
          <AppText subtitle2>{props.item.name}</AppText>
          <AppText style={{ marginTop: 4 }} caption>
            {StringHelper.formatPhoneNumber(props.item.phoneNumber)}
          </AppText>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {props.isNatcash ? (
          <Image
            resizeMode="contain"
            style={{ height: 60 }}
            source={images.logo_home}
          />
        ) : (
          <AppButton
            onPress={() => onInvite()}
            customBtnStyle={{
              backgroundColor: theme.colors?.secondary,
              height: 40,
            }}
            disabledStyle={{ backgroundColor: '#F1F2F2' }}
            disabledTitleStyle={{ color: theme.colors?.grey1 }}
            disabled={invited}
            title={t(translations.inviteFriends.invite)}
          />
        )}
      </View>
    </View>
  );
};

const InviteContactList = (props: {

  onShowFlash?: (message: string, type: 'success' | 'danger') => void;
}) => {
  const { theme, t, translations, dispatch } = useBaseHook();

  const {
    lastUpdated,
    listNotAccountEWallet,
    listInviteNumber,
    listPhoneNumberWithWallet,
  } = useAppSelector(state => state.ContactReducer.invite) || {};
  const [listContacts, setListContacts] = useState<IContact[]>();
  const currentAction = useAppSelector(
    state => state.AuthenticationReducer.action,
  );
  const isUpdating = currentAction === ContactActions.getInfoInvite.requestName;

  const getInviteInfo = (listPhoneNumbers: (string | undefined)[]) => {
    if (_.isEmpty(listPhoneNumbers)) {
      return;
    }
    if (!lastUpdated || moment(moment()).diff(lastUpdated, 'minutes') > 60) {
      const params: IInviteInfoRequest = {
        msisdnArr: _.join(listPhoneNumbers),
        //   msisdnArr: '50940000155,50932561111',
        type: EInviteType.INVITE,
      };
      dispatch(ContactActions.getInfoInvite.request(params));
    }
  };
  const getListContact = useCallback(async () => {
    if (Platform.OS === 'android') {
      let status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (status === 'denied' || status === 'never_ask_again') {
        throw Error('Permissions not granted to access Contacts');
      }
    }
    const reFacterData = listContact => {
      if (Array.isArray(listContact)) {
        const newList = [];
        for (const contact of listContact) {
          if (Array.isArray(contact.phoneNumbers)) {
            for (const phone of contact.phoneNumbers) {
              // const nameContact =
              //   contact.displayName || contact.givenName || contact.familyName;
              // const arrShortName = (nameContact &&
              //   nameContact !== '' &&
              //   nameContact.split(' ')) || [''];
              // let shortName = '';
              // arrShortName.forEach(char => {
              //   if (char[0] !== undefined) {
              //     let str = '';
              //     str = char[0];
              //     shortName += str;
              //   }
              // });
              newList.push({
                name:
                  (contact.displayName && `${contact.displayName}`) ||
                  `${contact.givenName} ${contact.familyName}`,
                phoneNumber: phone.number,
              });
            }
          }
        }
        return newList;
      }
      return [];
    };
    Contacts.getAll().then(contacts => {
      const list = reFacterData(contacts);
      setListContacts(_.sortBy(list, 'name'));
      const listPhoneNumbers = _.filter(
        list,
        x => !_.isEmpty(x.phoneNumber),
      ).map(y => y.phoneNumber);
      getInviteInfo(listPhoneNumbers);
    });
  }, []);
  useEffect(() => {
    getListContact().catch(console.error);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: Mixin.moderateSize(16),
        paddingHorizontal: Mixin.moderateSize(16),
        width: '100%',
        backgroundColor: '#F2F2F2',
      }}>
      {/* <AppText style={{ marginBottom: Mixin.moderateSize(16) }} subtitle1>
        {t(translations.inviteFriends.inviteYourFriends)}
      </AppText> */}
      <View
        style={{
          marginBottom: Mixin.moderateSize(8),
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <AppText  subtitle1>
          {t(translations.inviteFriends.inviteYourFriends)}
        </AppText>
        <TouchableOpacity
          onPress={() => {
            if (isUpdating) {
              return;
            }
            const listPhoneNumbers = _.filter(
              listContacts,
              x => !_.isEmpty(x.phoneNumber),
            ).map(y => y.phoneNumber);
            const params: IInviteInfoRequest = {
              msisdnArr: _.join(
                listPhoneNumbers.map(x => _.replace(x || '', /[^0-9]/g, '')),
              ),
              //   msisdnArr: '50940000155,50932561111',
              type: EInviteType.INVITE,
            };

            dispatch(ContactActions.getInfoInvite.request(params));
          }}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!isUpdating && (
            <Icon name="autorenew" color={theme.colors?.secondary} />
          )}
          <AppText style={{ color: theme.colors?.secondary }} subtitle1>
            {isUpdating ? t(translations.inviteFriends.updating) : t(translations.inviteFriends.updateContacts)}
          </AppText>
        </TouchableOpacity>
      </View>
      {/* <FlatList
        contentContainerStyle={{ paddingVertical: Mixin.moderateSize(8) }}
        showsVerticalScrollIndicator={false}
        // keyExtractor={x => `${x.phoneNumber}`}
        keyExtractor={item => item.phone}
        data={listContacts}
        renderItem={({ item, index }) => (
          <InviteItem
            isNatcash={listPhoneNumberWithWallet?.includes(
              item.phoneNumber || '',
            )}
            isInvited={listInviteNumber?.includes(item.phoneNumber || '')}
            item={item}
            onShowFlash={props.onShowFlash}
          />
        )}
      /> */}
      <BigList
        data={listContacts}
        renderItem={({ item, index }) => (
          <InviteItem
            isNatcash={listPhoneNumberWithWallet?.includes(
              item.phoneNumber || '',
            )}
            isInvited={listInviteNumber?.includes(item.phoneNumber || '')}
            item={item}
            onShowFlash={props.onShowFlash}
          />
        )}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        itemHeight={100}
      />
    </View>
  );
};

export const Invite = () => {
  const { theme, t, translations, dispatch } = useBaseHook();

  const [shareLink, setShareLink] = useState<string>();
  const urlInvite = useAppSelector(
    state => state.AuthenticationReducer.urlInvite,
  );
  const accountNumber = useAppSelector(
    state => state.AuthenticationReducer.accountNumber,
  );
  const flashRef = useRef<FlashMessage>();
  const styles = useStyles(theme);
  useEffect(() => {
    getShareLink();
  }, []);

  const getShareLink = async () => {
    const response = await InviteServices.shareLink();
    if (response.succeeded) {
      setShareLink(response.data?.setReferralLink);
    }
  };
  const onShare = async () => {
    const shareOption = {
      message: `Natcash is a great e-wallet app, you have received an experience invitation from ${accountNumber}. Download it right here: ${shareLink}`,
    };
    try {
      const shareResponse = await Share.open(shareOption);
    } catch (error) { }
  };
  const onShowFlash = (message: string, type: 'success' | 'danger') => {
    if (flashRef) {
      flashRef.current?.showMessage({
        message,
        type,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        filled
        title={t(translations.inviteFriends.inviteFriends)}
        renderRight={
          <TouchableOpacity
            onPress={() => onShare()}
            style={{
              padding: 4,
              borderRadius: 8,

              backgroundColor: 'rgba(225,225,225,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              color={'white'}
              size={Mixin.moderateSize(18)}
              name={'share-variant'}
            />
          </TouchableOpacity>
        }
      />
      <View style={styles.referralContainer}>
        <AppText subtitle2> {t(translations.inviteFriends.referralToGetReward)}</AppText>
        <View
          style={{
            marginTop: Mixin.moderateSize(16),
            flexDirection: 'row',
          }}>
          <QRCode
            value={shareLink || 'test'}
            size={Mixin.device_width / 3.5}
            logoBackgroundColor="transparent"
          />
          <View
            style={{
              marginLeft: Mixin.moderateSize(16),
              flex: 2,
              justifyContent: 'space-between',
            }}>
            <View style={styles.inputContainer}>
              <AppText style={{ flex: 1 }} body1>
                {shareLink}
              </AppText>
              <TouchableOpacity
                onPress={() => Clipboard.setString(`${shareLink}`)}
                style={{
                  height: '100%',
                  alignItems: 'center',
                  backgroundColor: theme.colors?.primary,
                  justifyContent: 'center',
                  paddingHorizontal: Mixin.moderateSize(16),
                  borderRadius: Mixin.moderateSize(4),
                }}>
                <AppText style={{ color: 'white' }} subtitle2>
                  {t(translations.inviteFriends.copy)}
                </AppText>
              </TouchableOpacity>
            </View>
            <View>
              <AppText
                style={{ marginVertical: Mixin.moderateSize(8) }}
                subtitle2>
                {t(translations.inviteFriends.referralCode)}
              </AppText>
              <View style={styles.inputContainer}>
                <AppText style={{ color: theme.colors?.primary }} subtitle2>
                  {formatNumber(accountNumber)}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
      {<InviteContactList onShowFlash={onShowFlash} />}
      <FlashMessage
        style={{
          ...GlobalStyles.shadow,
          // backgroundColor: theme.colors?.success,
        }}
        ref={ref => {
          if (ref) {
            flashRef.current = ref;
          }
        }}
        titleStyle={{ fontWeight: 'bold', color: theme.colors?.white }}
        textStyle={{ color: 'black' }}
        position="bottom"
      />
    </View>
  );
};
