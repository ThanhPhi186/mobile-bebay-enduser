import React, {useEffect, useRef, useState} from 'react';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import useStyles from './styles';
import {Alert, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AppHeader from 'components/modules/Header';
import {Image} from 'react-native-elements';
import {images} from 'assets';
import {EncryptHelper, Mixin} from 'helpers';
import AppText from 'components/atoms/AppText';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import QRServices from 'services/QRServices';
import {BottomModal} from 'components/atoms/BottomModal';
import {IScanAccountInfo} from 'models/services/IQRScan';
import {ErrorModal} from 'components/modules/ErrorModal';

interface IScanResultModal {
  isVisible: boolean;
  onCancel: () => void;
  onSelect: (type: ETransaction) => void;
}
enum ETransaction {
  Transfer,
  TopUp,
  Data,
}
const Transactions = [
  {
    id: ETransaction.Transfer,
  },
  {
    id: ETransaction.TopUp,
  },
  {
    id: ETransaction.Data,
  },
];

const ScanResultModal = (props: IScanResultModal) => {
  const {t, translations, theme} = useBaseHook();
  const styles = useStyles(theme);
  const getTransactionName = (id: ETransaction) => {
    switch (id) {
      case ETransaction.Transfer:
        return t(translations.transfer.transferMoney);
      case ETransaction.TopUp:
        return t(translations.topUp.topUp);
      case ETransaction.Data:
        return t(translations.data.dataExchange);
      default:
        break;
    }
  };

  return (
    <BottomModal
      canDismiss
      onCancel={() => props.onCancel()}
      isVisible={props.isVisible}
      disabledConfirm>
      <View style={styles.modalContainer}>
        {Transactions.map((transaction, index) => {
          return (
            <TouchableOpacity
              onPress={() => props.onSelect(transaction.id)}
              style={[
                styles.transactionContainer,
                index === Transactions.length - 1 ? styles.lastItem : null,
              ]}>
              <AppText subtitle2>{getTransactionName(transaction.id)}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomModal>
  );
};

export const QRScan = () => {
  const {t, translations, theme} = useBaseHook();
  const [light, setLight] = useState(false);
  const styles = useStyles(theme);
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const {navigation} = useGetNavigation();
  const camera = useRef<RNCamera>();
  const [lastBarCode, setLastBarCode] = useState('');
  const [showConsumerModal, setShowConsumerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consumerData, setConsumerData] = useState<IScanAccountInfo>();
  const [error, setError] = useState<{title: string; description?: string}>();
  const [showError, setShowError] = useState(false);
  const getScanData = async (qrCode: string) => {
    setLoading(true);
    const signature = await EncryptHelper.encryptSha256(
      qrCode,
      authenticationReducer.signatureKey!,
    );
    const body = {
      signature,
      qrCode,
    };
    const response = await QRServices.scan(body);
    if (response?.succeeded && !response.failed) {
      if (response.data?.accountInfo) {
        setShowConsumerModal(true);
        setConsumerData(response.data.accountInfo);
      }
    } else {
      setError({
        title: t(translations.error),
        description: response!.data?.message,
      });
      setTimeout(() => {
        setShowError(true);
      }, 50);
    }
  };
  const consumerNavigation = (id: ETransaction) => {
    switch (id) {
      case ETransaction.Transfer:
        navigation.navigate('TransferMoney', {accountInfo: consumerData!});
        break;
      case ETransaction.TopUp:
        navigation.navigate('TopUp', {accountInfo: consumerData!});
        break;
      case ETransaction.Data:
        navigation.navigate('DataExchange', {accountInfo: consumerData!});
        break;
      default:
        break;
    }
  };
  const onScan = (qrCode: string) => {
    setLastBarCode(qrCode);
    getScanData(qrCode);
    camera.current?.pausePreview();
  };
  const reset = () => {
    setShowConsumerModal(false);
    setShowError(false);
    setError(undefined);
    setTimeout(() => {
      setLoading(false);
      setLastBarCode('');
      camera.current?.resumePreview();
    }, 100);
  };
  const onSelectConsumer = (id: ETransaction) => {
    setShowConsumerModal(false);
    consumerNavigation(id);
    reset();
  };
  const onCancelConsumerModal = () => {
    setShowConsumerModal(false);
    reset();
  };

  useEffect(() => {
    // getScanData(
    //   'hQVDUFYwMWEPUAdOYXRjYXNonwgDAAABYjdfIAlUaGFuaCBQaGlfLQdFTkdMSVNInyQLNTA5NDAwMDAwMDSfJQI2c19QCzUwOTQwMDAwMDA0',
    // );
  });
  return (
    <View style={styles.container}>
      <AppHeader title={t(translations.scan)} transparent />
      {/* <View style={{backgroundColor: 'blue', width: 400, height: 300}} /> */}
      <RNCamera
        style={styles.scanner}
        captureAudio={false}
        ref={ref => {
          if (ref) {
            camera.current = ref;
          }
        }}
        type={RNCamera.Constants.Type.back}
        flashMode={
          light
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={barcodes => {
          if (barcodes.data !== lastBarCode && !loading) {
            onScan(barcodes.data);
          }
        }}>
        <BarcodeMask
          showAnimatedLine={false}
          edgeBorderWidth={0}
          edgeRadius={16}
          // lineAnimationDuration={700}
          height={250}
          width={250}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: Mixin.device_height / 2 + 150,
          }}>
          <AppText body1 style={{color: 'white'}}>
            {t(translations.qrScan.manual)}
          </AppText>
        </TouchableOpacity>
      </RNCamera>

      <TouchableOpacity
        onPress={() => setLight(!light)}
        style={{position: 'absolute', alignSelf: 'center', bottom: 80}}>
        <Image
          style={{
            height: Mixin.moderateSize(50),
            width: Mixin.moderateSize(50),
          }}
          source={images.light}
        />
      </TouchableOpacity>
      <ScanResultModal
        isVisible={showConsumerModal}
        onCancel={() => onCancelConsumerModal()}
        onSelect={type => onSelectConsumer(type)}
      />
      <ErrorModal
        confirmTitle={t(translations.cancel)}
        onConfirm={() => reset()}
        isVisible={showError}
        title={`${error?.title}`}
        description={`${error?.description}`}
      />
    </View>
  );
};
