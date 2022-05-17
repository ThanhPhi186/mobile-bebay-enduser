import {Mixin} from 'helpers';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import React, {useState, useEffect, useCallback} from 'react';
import {
  ViewProps,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  UIManager,
  View,
  Image,
  TextInput,
} from 'react-native';
import {images} from '../../assets';
import {makeStyles, OverlayProps} from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import {Overlay} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import Contacts from 'react-native-contacts';
import _ from 'lodash';
import moment from 'moment';
import {EInviteType, IInviteInfoRequest} from 'models/services/IInvite';
import {ContactActions} from 'stores/actions';

interface IContactDetailProps extends ViewProps {
  avatar: string;
  name: string;
  phoneNumber: string;
  shortName: string;
}
interface IContactProps extends ViewProps {
  showModalContact: boolean;
  onPressCloseModal: () => void;
  onSelect: (item: IContactDetailProps) => void;
  onRequestClose?: () => void;
}
const useStyles = makeStyles(theme => ({
  overlay: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftView: {
    width: '15%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingVertical: Mixin.moderateSize(3),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  centerView: {
    width: '65%',
    padding: Mixin.moderateSize(5),
    justifyContent: 'center',
  },
  rightView: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButton: {
    width: '100%',
    height: Mixin.moderateSize(25),
    borderRadius: Mixin.moderateSize(5),
    backgroundColor: '#00659F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: Mixin.moderateSize(35),
    height: Mixin.moderateSize(35),
  },
  titleTxt: {
    color: '#84888D',
    fontWeight: '500',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  descriptionTxt: {
    color: theme.colors?.black,
    fontWeight: '600',
    fontSize: Mixin.moderateSize(16),
    marginTop: 0,
  },
  buttonTxt: {
    fontWeight: '700',
    fontSize: Mixin.moderateSize(14),
    marginTop: 0,
  },
  btnContact: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  mediumText: {
    fontSize: Mixin.moderateSize(12),
    color: theme.colors?.white,
    fontWeight: '500',
  },
  largeText: {
    fontSize: Mixin.moderateSize(14),
    color: theme.colors?.white,
    fontWeight: '700',
  },
  avatarContainer: {
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
    borderRadius: Mixin.moderateSize(25),
    backgroundColor: theme.colors?.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderRadius: 12,
    height: Mixin.moderateSize(36),
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 20,
    marginVertical: 10,
    borderColor: '#DDDDDD',
    borderWidth: 1,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    fontSize: 16,
    marginHorizontal: 12,
    width: '90%',
    height: 40,
    marginVertical: 5,
  },
}));
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const Contact = (props: IContactProps) => {
  const {theme, t, translations, dispatch} = useBaseHook();
  const styles = useStyles(theme);
  const [contacts, setContacts] = useState([]);
  const [valueSearch, setValueSearch] = useState('');
  const [listSearchContacts, setListSearchContacts] = useState([]);
  const {lastUpdated, listPhoneNumberWithWallet} = useAppSelector(
    state => state.ContactReducer.notInvite,
  );
  const invite = useAppSelector(state => state.ContactReducer.invite);
  useEffect(() => {
    if (props.showModalContact) {
      getListContact().catch(console.error);
    }
  }, [props.showModalContact]);
  const getListContact = useCallback(async () => {
    if (Platform.OS === 'android') {
      let status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (status === 'denied' || status === 'never_ask_again') {
        throw Error('Permissions not granted to access Contacts');
      }
    }
    Contacts.getAll().then(contacts => {
      let arr = reFacterData(contacts);
      if (!lastUpdated || moment().diff(moment(lastUpdated), 'minutes') > 60) {
        const params: IInviteInfoRequest = {
          msisdnArr: _.join(
            arr.map(x => _.replace(x.phoneNumber, /[^0-9]/g, '')),
          ),
          type: EInviteType.NOT_INVITE,
        };
        dispatch(ContactActions.getInfoInvite.request(params));
      }
      setContacts(_.sortBy(arr, 'name'));
    });
  }, []);

  const updateSearch = (search: string) => {
    setValueSearch(search);
    const dataSearch = contacts.filter(item => {
      const itemData =
        item.name.toUpperCase() +
        ' ' +
        item.phoneNumber.toUpperCase().replace(/ /g, '');
      return itemData.indexOf(search.toUpperCase()) > -1;
    });
    setListSearchContacts(dataSearch);
  };
  const reFacterData = listContact => {
    if (Array.isArray(listContact)) {
      const newList = [];
      for (const contact of listContact) {
        if (Array.isArray(contact.phoneNumbers)) {
          for (const phone of contact.phoneNumbers) {
            const nameContact =
              contact.displayName || contact.givenName || contact.familyName;
            const arrShortName = (nameContact &&
              nameContact !== '' &&
              nameContact.split(' ')) || [''];
            let shortName = '';
            arrShortName.forEach(char => {
              if (char[0] !== undefined) {
                let str = '';
                str = char[0];
                shortName += str;
              }
            });
            newList.push({
              name:
                (contact.displayName && `${contact.displayName}`) ||
                `${contact.givenName} ${contact.familyName}`,
              phoneNumber: phone.number,
              avatar: contact.thumbnailPath,
              shortName: shortName,
            });
          }
        }
      }
      return newList;
    }
    return [];
  };

  const onPressItem = (item: IContactDetailProps) => {
    props.onSelect(item);
  };
  const renderPromotion = (props: IContactDetailProps) => (
    <TouchableOpacity
      onPress={() => onPressItem(props)}
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderColor: '#DDDDDD',
        borderBottomWidth: 1,
      }}>
      {props?.shortName ? (
        <View style={styles.avatarContainer}>
          <AppText style={[styles.mediumText, {color: '#263238'}]}>
            {props?.shortName}
          </AppText>
        </View>
      ) : (
        <Image style={{width: 50, height: 50}} source={images.avatar} />
      )}
      <View style={{marginHorizontal: 10}}>
        <AppText style={[styles.mediumText, {color: '#263238'}]}>
          {props.name}
        </AppText>
        <AppText style={[styles.mediumText, {color: '#263238'}]}>
          {props.phoneNumber}
        </AppText>
      </View>
      {(
        (listPhoneNumberWithWallet || '') +
        (invite.listPhoneNumberWithWallet || '')
      ).includes(_.replace(props.phoneNumber, /[^0-9]/g, '')) && (
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
          <Image
            resizeMode="contain"
            style={{height: 40, width: 60}}
            source={images.logo_home}
          />
        </View>
      )}
    </TouchableOpacity>
  );
  return (
    <Overlay
      isVisible={props.showModalContact}
      onRequestClose={props.onRequestClose}
      // onBackdropPress={() => setModalAvatar(false)}
      overlayStyle={styles.overlay}>
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        <View
          style={{
            width: '100%',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppText style={[styles.largeText, {color: '#263238'}]}>
            {t(translations.selectPhone)}
          </AppText>
          <TouchableOpacity
            onPress={() => props.onPressCloseModal()}
            style={{
              width: 40,
              height: 40,
              position: 'absolute',
              right: 0,
              top: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <AppText style={[styles.largeText, { color: '#263238' }]}>{'X'}</AppText> */}
            <Image
              style={{width: 30, height: 30}}
              resizeMode={'contain'}
              source={images.IconClose}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Image source={images.iconSearchService} />
          <TextInput
            style={styles.inputContainer}
            placeholder={t(translations.home.search)}
            placeholderTextColor="#545456"
            value={valueSearch}
            onChangeText={text => updateSearch(text)}
          />
          {valueSearch ? (
            <TouchableOpacity
              style={{position: 'absolute', right: 20}}
              onPress={() => setValueSearch('')}>
              <Image source={images.iconClear} />
            </TouchableOpacity>
          ) : null}
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={valueSearch ? listSearchContacts : contacts}
          numColumns={1}
          renderItem={item => renderPromotion(item.item)}
          keyExtractor={item => item.phone}
          extraData={contacts}
        />
      </SafeAreaView>
    </Overlay>
  );
};
export default Contact;
