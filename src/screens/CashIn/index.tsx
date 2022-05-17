import React, { useEffect, useState } from 'react';
import Container from 'components/atoms/Container';
import AppHeader from 'components/modules/Header';
import { HookHelper, Mixin } from 'helpers';
import { Image, TouchableOpacity, View } from 'react-native';
import { images } from 'assets';
import AppText from 'components/atoms/AppText';
import { styles } from './styles';
import hasLocationPermission from 'helpers/locationHelper';
import SimpleToast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import { IntroductionModal } from 'components/modules/IntroductionModal';
import { AuthenticationActions } from 'stores/actions';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import { FEATURE_CODE } from 'models/EFeatureCode';
import { useCommon } from 'helpers/features/common';
import { IDataIntro } from 'models/services/IRecent';
import { useLoadingContext } from 'helpers/loadingHelper';

const ItemBank = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: any;
  onPress: any;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemServiceContainer}>
    <View style={styles.iconService}>
      <Image style={styles.iconBank} source={icon} />
    </View>
    <AppText style={styles.mediumText}>{title}</AppText>
  </TouchableOpacity>
);

export const CashIn = () => {
  const { t, translations, dispatch } = HookHelper.useBaseHook();

  const { navigation } = useGetNavigation();
  const [showBottomModalIntro, setShowBottomModalIntro] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const { onGetListRecent } = useCommon();
  const [dataIntro, setDataIntro] = useState<IDataIntro[]>();
  const { showLoading, hideLoading } = useLoadingContext();

  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const listBank = [
    { icon: images.icon_bnc_bank, name: 'BNC' },
    { icon: images.icon_capital_bank, name: 'Capital Carte' },
    { icon: images.icon_uni_bank, name: 'UNIBANK' },
  ];
  useEffect(() => {
    const getListRecentData = async () => {
      showLoading();
      const response = await onGetListRecent(FEATURE_CODE.CASHIN);
      setDataIntro(response?.introduction!)
      hideLoading();
      setTimeout(() => {
        if (!authenticationReducer?.isShowIntro?.includes(FEATURE_CODE.CASHIN)) {
          setShowBottomModalIntro(true);
        }
      }, 1000);
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
      arrScreen.push(FEATURE_CODE.CASHIN);
      dispatch(AuthenticationActions.setShowIntro.request(arrScreen));
    }
  }
  const onHideIntro = (code: boolean) => {
    setHideIntro(code)
  }

  return (
    <Container scrollEnabled={false}>
      <AppHeader filled title={t(translations.home.deposit)} />
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MapScreen')}
          style={styles.btnCashOut}>
          <View style={styles.viewIcon}>
            <Image source={images.icon_withdraw_location} style={styles.icon} />
          </View>
          <View style={styles.viewTextTitle}>
            <AppText subtitle3>{t(translations.cashIn.viaAgent)}</AppText>
            {/* <AppText caption style={{marginTop: 4}}>
            {t(translations.withdraw.generateCodeGetCash)}
          </AppText> */}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnToBank}>
          <View style={styles.viewIcon}>
            <Image source={images.icon_withdraw_bank} style={styles.icon} />
          </View>
          <View style={styles.viewTextTitle}>
            <AppText subtitle3>
              {t(translations.withdraw.depositDomestic)}
            </AppText>
            <View style={styles.description}>
              <AppText caption>{t(translations.withdraw.chooseBank)}</AppText>
              <Image
                source={images.icon_withdraw_right}
                style={styles.iconRight}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.containerListBank}>
          {listBank.map((elm, index) => {
            return (
              <ItemBank
                onPress={() => navigation.navigate('ComingSoon')}
                key={index}
                icon={elm.icon}
                title={elm.name}
              />
            );
          })}
        </View>
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
  );
};
