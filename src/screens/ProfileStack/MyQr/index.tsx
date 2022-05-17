import React, {  useState,useEffect } from 'react';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import {
  useAppSelector,
  useBaseHook,
  useGetNavigation,
} from 'helpers/hookHelper';
import useStyles from './styles';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {images} from 'assets';
import {Mixin} from 'helpers';
import AppButton from 'components/atoms/Button';
import { IntroductionModal } from 'components/modules/IntroductionModal';
import { AuthenticationActions } from 'stores/actions';
import { FEATURE_CODE } from 'models/EFeatureCode';
import { useCommon } from 'helpers/features/common';
import { IDataIntro } from 'models/services/IRecent';
import { useLoadingContext } from 'helpers/loadingHelper';
import {Icon, Image} from 'react-native-elements';
import AppText from 'components/atoms/AppText';

export const MyQr = () => {
  const {theme, t, translations, dispatch} = useBaseHook();

  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const { showLoading, hideLoading } = useLoadingContext();

  const [showBottomModalIntro, setShowBottomModalIntro] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const { onGetListRecent } = useCommon();
  const [dataIntro, setDataIntro] = useState<IDataIntro[]>();

  useEffect(() => {
    const getListRecentData = async () => {
      const response = await onGetListRecent(FEATURE_CODE.USER_SCAN_QR);
      setDataIntro(response?.introduction!)
      if (!authenticationReducer?.isShowIntro?.includes(FEATURE_CODE.USER_SCAN_QR)) {
        setShowBottomModalIntro(true);
      }
    };
    getListRecentData();
    
  }, []);
  const onPressConfirm = () => {
    setShowBottomModalIntro(false)
    if (hideIntro) {
      const arrScreen = [];
      for (let i = 0; i < authenticationReducer?.isShowIntro.length; i += 1) {
        arrScreen.push(authenticationReducer?.isShowIntro[i])
      }
      arrScreen.push(FEATURE_CODE.USER_SCAN_QR);
      dispatch(AuthenticationActions.setShowIntro.request(arrScreen));
    }
  }
  const onHideIntro = (code: boolean) => {
    setHideIntro(code)
  }
  return (
    <ImageBackground
      style={{
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
      }}
      source={images.qrBackground}>
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            <Icon name="close" />
          </View>
          <AppText subtitle2 style={{marginLeft: 8, color: 'white'}}>
            Close
          </AppText>
        </TouchableOpacity>
      </View>
      <Image
        resizeMode="contain"
        style={{marginTop: Mixin.moderateSize(60), height: 100, width: 200}}
        source={images.logo}
      />
      <AppText subtitle1 style={{color: 'white', marginVertical: 16}}>
        My QR Code
      </AppText>
      <View style={styles.qrContainer}>
        <QRCode
          value={userInfo?.consumerQrCode || 'test'}
          logo={images.avatar}
          logoSize={80}
          logoBorderRadius={40}
          size={Mixin.device_height / 3.4}
          logoBackgroundColor="transparent"
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('QRScan')}
        style={styles.buttonContainer}>
        {/* <AppButton
          onPress={() => navigation.navigate('QRScan')}
          title={t(translations.scan)}
        />
      </View>
      <IntroductionModal
        onConfirm={() => onPressConfirm()}
        onHideIntro={code => onHideIntro(code)}
        isVisible={showBottomModalIntro}
        confirmTitle={t(translations.iGotIt)}
        imageUrl={dataIntro?.image || ''}
        title={dataIntro?.title || ''}
        title1={dataIntro?.content[0] || ''}
        title2={dataIntro?.content[1] || ''}
        title3={dataIntro?.content[2] || ''}>
      </IntroductionModal>
    </Container>
        /> */}
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 353,
            borderWidth: 3,
            borderColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText h6 style={{color: 'white'}}>
            {t(translations.scan)}
          </AppText>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};
