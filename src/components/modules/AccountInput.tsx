import {images} from 'assets';
import AppInput, {IAppInputRef} from 'components/atoms/AppInput';
import {Mixin} from 'helpers';
import {useCommon} from 'helpers/features/common';
import {useBaseHook} from 'helpers/hookHelper';
import {validatePhoneNumber} from 'helpers/stringHelper';
import _ from 'lodash';
import {ICheckSubResponse} from 'models/services/ITransfer';
import React, {
  createRef,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {TouchableOpacity, View, ViewProps} from 'react-native';
import {Image, makeStyles} from 'react-native-elements';
import SimpleToast from 'react-native-simple-toast';
import Contact from './Contact';
import ContactDetail from './ContactDetail';
import {BottomModal} from 'components/atoms/BottomModal';
import AppText from 'components/atoms/AppText';

interface IAccountInput {
  accountString: string;
  onChangeText: (text: string) => void;
  needCheckSub?: boolean;
  onCheckSubResult?: (item: ICheckSubResponse) => void;
  dataCheckSub?: Partial<ICheckSubResponse>;
  onClear?: () => void;
  onBlur?: () => void;
  onClearInput?: () => void;
}
export interface IAccountInputRef {
  checkSub: (phoneNumber: string) => void;
}

interface IContactDetailProps extends ViewProps {
  avatar: string;
  name: string;
  phoneNumber: string;
  shortName: string;
}
interface IContact {
  title: string;
  description: any;
}
const useStyles = makeStyles(theme => ({
  buttonContact: {
    width: Mixin.moderateSize(40),
    height: Mixin.moderateSize(40),
    position: 'absolute',
    right: Mixin.moderateSize(16),
    top: Mixin.moderateSize(16),
    zIndex: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: Mixin.moderateSize(20),
    height: Mixin.moderateSize(20),
  },
  btnClose: {
    position: 'absolute',
    right: Mixin.moderateSize(56),
    top: Mixin.moderateSize(15),
    marginHorizontal: Mixin.moderateSize(10),
    backgroundColor: 'white',
    height: Mixin.moderateSize(40),
    width: Mixin.moderateSize(30),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: Mixin.moderateSize(20),
    height: Mixin.moderateSize(20),
  },
  WarningBalanceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  iconWarning: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(60),
    marginVertical: Mixin.moderateSize(20),
  },
}));

export const AccountInput = forwardRef(
  (props: IAccountInput, ref: Ref<IAccountInputRef>) => {
    const {theme, t, translations} = useBaseHook();
    const styles = useStyles(theme);
    const [showModalContact, setShowModalContact] = useState(false);
    const [checkSubData, setCheckSubData] = useState<ICheckSubResponse>();
    const inputRef = createRef<IAppInputRef>();
    const {onCheckSub} = useCommon();
    const [showBottomModal, setShowBottomModal] = useState(false);
    const [errorMessageTransaction, setErrorMessageTransaction] = useState('');

    const onOpenContact = () => {
      setShowModalContact(true);
    };
    const onSelectNumber = (item: IContactDetailProps) => {
      setShowModalContact(false);
      checkPhoneNumber(item.phoneNumber.replace(/[^0-9]+/g, ''));
    };
    const onClear = () => {
      setCheckSubData(undefined);
      if (inputRef) {
        setTimeout(() => {
          // inputRef.current?.focus();
          props.onChangeText('');
        }, 100);
      }
    };
    useImperativeHandle(ref, () => ({
      checkSub(phoneNumber: string) {
        checkPhoneNumber(phoneNumber);
      },
    }));

    const checkPhoneNumber = async (phoneNumber: string) => {
      props.onChangeText(phoneNumber);
      if (validatePhoneNumber(phoneNumber)) {
        if (props.needCheckSub) {
          const result = await onCheckSub(phoneNumber);
          if (result?.succeed) {
            const data = result?.data!;
            // setPhoneNumberAccountString(data.accountNumber);
            props.onCheckSubResult && props.onCheckSubResult(data);
          } else {
            setTimeout(() => {
              // SimpleToast.show(${result?.data?.message}", SimpleToast.LONG);
              setShowBottomModal(true);
              setErrorMessageTransaction(result?.data?.message!);
            }, 200);
          }
        }
      }
    };
    return (
      <>
        {props.dataCheckSub ? (
          <ContactDetail
            isContact
            rightButton
            title={`${props.dataCheckSub.accountName!.toUpperCase()}`}
            description={`${props.dataCheckSub?.accountNumber}`}
            onPress={() => onOpenContact()}
            onClear={() => props.onClear && props.onClear()}
          />
        ) : (
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={() => onOpenContact()}
              style={styles.buttonContact}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={images.IconContact}
              />
            </TouchableOpacity>
            <AppInput
              ref={inputRef}
              label={t(translations.transfer.phoneNumber)}
              value={props.accountString}
              containerStyles={{marginVertical: 5}}
              keyboardType="phone-pad"
              autoFocus
              onBlur={e => {
                checkPhoneNumber(props.accountString);
                props.onBlur && props.onBlur();
              }}
              onChangeText={text => props.onChangeText(text)}
            />
            {props.onClearInput && props.accountString.length > 0 ? (
              <TouchableOpacity
                style={styles.btnClose}
                onPress={() => props.onClearInput && props.onClearInput()}>
                <Image
                  resizeMode={'contain'}
                  source={images.IconClose}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        <Contact
          onRequestClose={() => setShowModalContact(false)}
          onPressCloseModal={() => setShowModalContact(false)}
          onSelect={onSelectNumber}
          showModalContact={showModalContact}
        />
        <BottomModal
          onConfirm={() => setShowBottomModal(false)}
          isVisible={showBottomModal}
          confirmTitle={t(translations.changePin.tryAgain)}>
          <View style={styles.WarningBalanceContainer}>
            <Image
              style={styles.iconWarning}
              source={images.IconWarning}></Image>
            <AppText caption>{errorMessageTransaction}</AppText>
          </View>
        </BottomModal>
      </>
    );
  },
);
