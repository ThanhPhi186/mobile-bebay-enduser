import React, { useEffect, useState } from 'react';

import AppHeader from 'components/modules/Header';
import { HookHelper, Mixin } from 'helpers';
import Container from 'components/atoms/Container';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from 'components/atoms/AppText';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import GradientText from 'components/atoms/GradientText';
import { useData } from 'helpers/features/data';
import { IBuyDataService, IPackageData } from 'models/services/IData';
import SimpleToast from 'react-native-simple-toast';
import { useLoadingContext } from 'helpers/loadingHelper';
import { BottomModal } from 'components/atoms/BottomModal';
import { images } from 'assets';
import { styles } from './styles';
import ItemPackageData from './component/ItemPackageData';
import { IntroductionModal } from 'components/modules/IntroductionModal';
import { AuthenticationActions } from 'stores/actions';
import { useAppSelector, useGetNavigation } from 'helpers/hookHelper';
import { FEATURE_CODE } from 'models/EFeatureCode';
import { useCommon } from 'helpers/features/common';
import { IDataIntro } from 'models/services/IRecent';

export const DataExchange = () => {
  const { theme, t, translations, dispatch } = HookHelper.useBaseHook();
  const { navigation, route } = useGetNavigation<'DataExchange'>();
  const accountInfo = route.params?.accountInfo;
  const { onGetDataService, onGetDataInfo } = useData();
  const { showLoading, hideLoading } = useLoadingContext();

  const languageReducer = useAppSelector(state => state.LanguageReducer);

  const [typeData, setTypeData] = useState('1');

  const [packageData, setPackageData] = useState<Array<IPackageData>>([]);

  const [dataService, setDataService] = useState<Array<IBuyDataService>>([]);

  const [transId, setTransId] = useState<string>('');

  const [showBottomModal, setShowBottomModal] = useState(false);

  const [errorMessageData, setErrorMessageData] = useState('');
  const [showBottomModalIntro, setShowBottomModalIntro] = useState(false);
  const [hideIntro, setHideIntro] = useState(false);
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  const { onGetListRecent } = useCommon();
  const [dataIntro, setDataIntro] = useState<IDataIntro[]>();

  const getDataService = async () => {
    showLoading();
    const dataServiceResponse = await onGetDataService();
    // const data = Object.values(dataServiceResponse?.data?.buyDataConfigs || {});
    const data = dataServiceResponse?.data?.buyDataConfigs!;
    setTransId(`${dataServiceResponse?.data?.transId}`);
    setDataService(data);
    setPackageData(data[0]?.groupDataPackageInfoList);
    hideLoading();
    setTimeout(() => {
      if (!authenticationReducer?.isShowIntro?.includes(FEATURE_CODE.DATA_MONEY)) {
        setShowBottomModalIntro(true)
      }
    }, 1200);

  };

  useEffect(() => {
    getDataService();
    const getListRecentData = async () => {
      const response = await onGetListRecent(FEATURE_CODE.DATA_MONEY);
      setDataIntro(response?.introduction!)
    };
    getListRecentData();
  }, []);

  const goDataInfo = async (item: IPackageData) => {
    const serviceCode = dataService.filter(elm => elm.code === typeData)[0]
      .code;

    const dataInfo = await onGetDataInfo(transId, serviceCode, item.code);

    if (!dataInfo?.failed) {
      navigation.navigate('BuyData', { dataInfo: dataInfo?.data!, accountInfo });
    } else {
      setShowBottomModal(true);
      setErrorMessageData(dataInfo?.data?.message!);
    }
  };
  const onPressConfirm = () => {
    setShowBottomModalIntro(false)
    if (hideIntro) {
      const arrScreen = [];
      for (let i = 0; i < authenticationReducer?.isShowIntro.length; i += 1) {
        arrScreen.push(authenticationReducer?.isShowIntro[i])
      }
      arrScreen.push(FEATURE_CODE.DATA_MONEY);
      dispatch(AuthenticationActions.setShowIntro.request(arrScreen));
    }
  }
  const onHideIntro = (code: boolean) => {
    setHideIntro(code)
  }

  const changeService = (elm: IBuyDataService, index: number) => {
    setTypeData(elm.code);
    setPackageData(dataService[index].groupDataPackageInfoList);
  };

  const renderItem = (item: IPackageData) => {
    return <ItemPackageData item={item} onPress={() => goDataInfo(item)} />;
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t(translations.data.dataExchange)} filled />
      <View style={styles.containerListService}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 8 }}>
          {dataService.map((elm, index: number) => (
            <TouchableOpacity
              onPress={() => changeService(elm, index)}
              style={[
                styles.viewService,
                {
                  backgroundColor:
                    typeData === elm.code ? '#FFF6E9' : '#F4F4F4',
                },
              ]}
              key={index}>
              <AppText
                subtitle3
                style={{
                  color:
                    typeData === elm.code ? theme.colors?.primary : 'black',
                }}>
                {elm.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={packageData}
        renderItem={item => renderItem(item.item)}
        keyExtractor={(item, index) => index.toString()}
        // numColumns={2}
        // columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ padding: 16 }}
      />
      <BottomModal
        onConfirm={() => setShowBottomModal(false)}
        isVisible={showBottomModal}
        confirmTitle={t(translations.changePin.tryAgain)}>
        <View style={styles.warningBalanceContainer}>
          <Image style={styles.iconWarning} source={images.IconWarning}></Image>
          <AppText caption>{errorMessageData}</AppText>
        </View>
      </BottomModal>
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
    </View>
  );
};
