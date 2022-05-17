import React, {useEffect, useRef, useState} from 'react';
import {Overlay} from 'react-native-elements';

import {EncryptHelper, Mixin, StringHelper} from 'helpers';
import {makeStyles} from 'react-native-elements';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import {Image, TouchableOpacity, View} from 'react-native';
import AppHeader from './Header';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import AppText from 'components/atoms/AppText';
import {images} from 'assets';
import QRServices from 'services/QRServices';
import {IScanAccountInfo} from 'models/services/IQRScan';
import {ErrorModal} from './ErrorModal';
interface IScanModalProps {
  isVisible: boolean;
  onFinish: (data: IScanAccountInfo) => void;
  onCancel: () => void;
}
export const ScanModal = (props: IScanModalProps) => {
  const {theme, t, translations} = useBaseHook();
  const camera = useRef<RNCamera>();
  const [light, setLight] = useState(false);
  const [lastBarCode, setLastBarCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{title: string; description?: string}>();
  const [showError, setShowError] = useState(false);
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const styles = useStyles(theme);
  useEffect(() => {
    if (!props.isVisible) {
      setLastBarCode('');
    }
  }, [props.isVisible]);
  const onScan = (data: string) => {
    setLastBarCode(data);
    getScanData(data);
    camera.current?.pausePreview();
  };
  const reset = () => {
    setShowError(false);
    setError(undefined);
    setTimeout(() => {
      setLoading(false);
      setLastBarCode('');
      camera.current?.resumePreview();
    }, 100);
  };
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
        props.onFinish(response.data.accountInfo!);
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
  return (
    <Overlay
      style={{
        padding: 0,
        width: Mixin.device_width,
        height: Mixin.device_height,
      }}
      isVisible={props.isVisible}>
      <View style={styles.container}>
        <AppHeader
          onPressLeft={() => props.onCancel()}
          title={t(translations.scan)}
          transparent
        />
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
            if (barcodes.data !== lastBarCode && props.isVisible) {
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
        {/* <ErrorModal
        confirmTitle={t(translations.cancel)}
        onConfirm={() => reset()}
        isVisible={showError}
        title={`${error?.title}`}
        description={`${error?.description}`}
      /> */}
      </View>
      <ErrorModal
        confirmTitle={t(translations.cancel)}
        onConfirm={() => reset()}
        isVisible={showError}
        title={`${error?.title}`}
        description={`${error?.description}`}
      />
    </Overlay>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    width: Mixin.device_width,
    height: Mixin.device_height + 20,
    marginBottom: -15,
    marginTop: -15,
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: Mixin.moderateSize(16),
    paddingTop: Mixin.moderateSize(16),
    paddingBottom: Mixin.moderateSize(16),
  },
  transactionContainer: {
    width: '100%',
    paddingVertical: Mixin.moderateSize(16),
    borderBottomColor: theme.colors?.grey4,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  scanner: {
    flex: 1,
    // height: Mixin.device_height,
    marginTop: Mixin.moderateSize(-100),
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 120,
    width: 200,
  },
}));
