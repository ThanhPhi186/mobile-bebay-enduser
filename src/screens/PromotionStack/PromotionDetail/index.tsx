import { getAvatarUrlFromNew } from 'assets';
import AppHeader from 'components/modules/Header';
import { useBaseHook, useGetNavigation } from 'helpers/hookHelper';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'react-native-elements';
import RenderHtml from 'react-native-render-html';
import useStyles from './styles';
import { WebView } from 'react-native-webview';
import AppButton from 'components/atoms/Button';
import { HookHelper, Mixin } from 'helpers';
import { BILL_TYPE } from 'models/EBillType';
import { useData } from 'helpers/features/data';
import uuid from 'react-native-uuid';
import {FEATURE_CODE} from 'models/EFeatureCode';
import {useAppSelector} from 'helpers/hookHelper';


const isValidURL = (url: string) => {
  var res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
};
export const PromotionDetail = () => {
  const { route, navigation } = useGetNavigation<'PromotionDetail'>();
  const promotion = route.params?.promotion;
  const { theme, t, translations, showLoading, hideLoading, dispatch } = HookHelper.useBaseHook();
  const styles = useStyles(theme);
  const {  onGetDataInfo } = useData();
  const onContinue = async () => {
    const dataService = JSON.parse(promotion.transactionData)
    gotoScreen(dataService.featureCode)
  };
  const userInfo = useAppSelector(
    state => state.AuthenticationReducer.userInfo,
  );
  const getData = async () =>{
    const transID = `${uuid.v4()}`.replace(/-/g, '');
    const dataService = JSON.parse(promotion.transactionData)
    const dataInfo = await onGetDataInfo(transID, dataService?.detail?.serviceCode, dataService?.detail?.packageCode);
    navigation.navigate('BuyData', { dataInfo: dataInfo?.data! });
  }
  const gotoScreen = (id: string) => {
    switch (id) {
      case FEATURE_CODE.TRANSFER_MONEY:
        navigation.navigate('TransferMoney');
        break;
      case FEATURE_CODE.CASHIN:
        navigation.navigate('CashIn');
        break;
      case FEATURE_CODE.TOP_UP_MONEY:
        navigation.navigate('TopUp');
        break;
      case FEATURE_CODE.DATA_MONEY:
        getData();
        break;
      case FEATURE_CODE.CASHOUT:
        navigation.navigate('Withdraw');
        break;
      case FEATURE_CODE.BILL_MONEY:
        navigation.navigate('Bill', { type: BILL_TYPE.POST_PAID });
        break;
      case FEATURE_CODE.BILL_INTERNET:
        navigation.navigate('Bill', { type: BILL_TYPE.INTERNET });
        break;
      default:
        navigation.navigate('ComingSoon');
        break;
    }
  };

  return (
    <>
      <AppHeader filled title={promotion?.title} />
      {promotion?.contentType === 0 ? (
        <View style={{ flex: 1 }}>
          <WebView
            style={{ width: '100%', flex: 1 }}
            source={
              isValidURL(promotion.fullContent)
                ? { uri: promotion.fullContent }
                : { html: promotion.fullContent }
            }
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          {promotion && (
            <Image
              resizeMode="cover"
              style={styles.image}
              source={{ uri: getAvatarUrlFromNew(promotion) }}
            />
          )}
          <RenderHtml
            contentWidth={Mixin.device_width - Mixin.moderateSize(32)}
            source={{ html: promotion?.fullContent || '' }}
          />
        </ScrollView>
      )}
      {promotion?.transactionNews == 1 && userInfo ? <View style={styles.buttonContainer}>
        <AppButton
          disabled={false}
          onPress={() => onContinue()}
          shadow
          title={t(translations.data.buy)}
        />
      </View> : null}
    </>
  );
};
