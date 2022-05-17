import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from 'components/modules/Header';
import {HookHelper, Mixin} from 'helpers';
import {useCashIn} from 'helpers/features/cashIn';
import {IListAgentLocation} from 'models/services/ICashin';
import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import SimpleToast from 'react-native-simple-toast';
import Geolocation from 'react-native-geolocation-service';
import hasLocationPermission from 'helpers/locationHelper';
import _ from 'lodash';
import {useLoadingContext} from 'helpers/loadingHelper';
import {Overlay, Slider} from 'react-native-elements';
import AppButton from 'components/atoms/Button';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.2;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 50;
const TYPE_MAP = {
  NORMAL: 1,
  DIRECTION: 2,
};

interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const MapScreen = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {showLoading, hideLoading} = useLoadingContext();
  const {onListAgentLocation} = useCashIn();

  const [region, setRegion] = useState<IRegion>({
    latitude: 18.5360606,
    longitude: -72.325327,
    latitudeDelta: 12,
    longitudeDelta: ASPECT_RATIO,
  });
  const [coords, setCoords] = useState<{latitude: number; longitude: number}>({
    latitude: 18.5360606,
    longitude: -72.325327,
  });

  const [dataAgent, setDataAgent] = useState<Array<IListAgentLocation>>();

  const [valueSlider, setValueSlider] = useState(1);
  const [showModalOpenMap, setShowModalOpenMap] = useState(false);
  const [selectAgent, setSelectAgent] = useState<IListAgentLocation>();

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    coords && getListAgentLocation();
  }, [coords, valueSlider]);

  const getLocation = async () => {
    try {
      showLoading();
      const locationPermission = await hasLocationPermission();

      if (!locationPermission) {
        return;
      }
      Geolocation.getCurrentPosition(
        position => {
          if (position) {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCoords(location);
            setRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
          }
        },
        error => {
          console.log('error', error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    } catch (error) {
      SimpleToast.show(`${error}`, SimpleToast.LONG);
    } finally {
      hideLoading();
    }
  };

  const getListAgentLocation = async () => {
    const response = await onListAgentLocation(
      `${coords?.latitude}`,
      `${coords?.longitude}`,
      `${valueSlider}`,
    );

    if (!response?.failed) {
      setDataAgent(response?.data?.listAgentLocation);
    } else {
      setTimeout(() => {
        SimpleToast.show(`${response?.data?.message}`, SimpleToast.LONG);
      }, 200);
    }
  };

  const openMap = (type: number) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const lat = selectAgent?.latitude;
    const long = selectAgent?.longitude;
    const latLng = `${lat},${long}`;
    const label = '';

    const url = Platform.select({
      ios: `https://www.google.com/maps/search/?api=1&query=${latLng}&center=${lat},${long}`,
      android: `${scheme}${latLng}(${latLng})`,
    });
    const urlDirection = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${latLng}`;
    Linking.canOpenURL(url!)
      .then(supported => {
        if (!supported) {
          const browser_url =
            'https://www.google.de/maps/@' + lat + ',' + long + '?q=' + label;
          return Linking.openURL(browser_url);
        } else {
          return Linking.openURL(
            type === TYPE_MAP.NORMAL ? url! : urlDirection,
          );
        }
      })
      .catch(err => console.log('error', err));
  };

  const onChangeSliderComplete = (value: number) => {
    setValueSlider(value);
  };

  const onPressAgent = (item: IListAgentLocation) => {
    setSelectAgent(item);
    setShowModalOpenMap(true);
  };

  const hideModalOpenMap = () => {
    setShowModalOpenMap(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader filled title={t(translations.withdraw.map)} />
      <View style={{flex: 1}}>
        <MapView provider={PROVIDER_GOOGLE} region={region} style={styles.map}>
          {coords?.latitude && (
            <Marker
              coordinate={coords}
              title={t(translations.withdraw.yourLocation)}>
              <View style={styles.containerImgMarker}>
                <Image
                  source={images.icon_withdraw_current_location}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </View>
            </Marker>
          )}
          {dataAgent?.map((elm: IListAgentLocation, index: number) => {
            return (
              <Marker
                coordinate={{
                  latitude: elm.latitude,
                  longitude: elm.longitude,
                }}
                key={index}
                onPress={() => onPressAgent(elm)}>
                <Image
                  source={images.icon_withdraw_location_agent}
                  style={{width: 48, height: 48, resizeMode: 'contain'}}
                />
                {/* <AppText
                  style={{
                    color: theme.colors?.primary,
                    fontWeight: 'bold',
                  }}>
                  {elm.name}
                </AppText> */}
              </Marker>
            );
          })}
        </MapView>
        <TouchableOpacity onPress={getLocation} style={styles.btnGps}>
          <Icon name="crosshairs-gps" size={24} color={theme.colors?.primary} />
        </TouchableOpacity>
        <View style={styles.box_control}>
          <View style={styles.box_control_top}>
            <AppText>{t(translations.withdraw.searchDistance)}</AppText>
            <Slider
              style={styles.slider}
              step={1}
              value={valueSlider}
              minimumValue={MIN_DISTANCE}
              maximumValue={MAX_DISTANCE}
              onSlidingComplete={value => onChangeSliderComplete(value)}
              minimumTrackTintColor={'#0187E0'}
              maximumTrackTintColor={'#0187E0'}
              thumbStyle={{
                height: 20,
                width: 20,
                backgroundColor: theme.colors?.primary,
              }}
            />
            <View style={styles.textCon}>
              <AppText>{MIN_DISTANCE} km</AppText>

              <AppText>{valueSlider} km</AppText>
              <AppText>{MAX_DISTANCE} km</AppText>
            </View>
          </View>

          <View style={styles.box_keyword}>
            <AppText numberOfLines={2} ellipsizeMode="tail">
              {t(translations.withdraw.agent)}
            </AppText>
            <Icon name="chevron-right" size={20} />
          </View>
        </View>
      </View>
      <Overlay
        onBackdropPress={hideModalOpenMap}
        overlayStyle={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          borderRadius: Mixin.moderateSize(8),
        }}
        isVisible={showModalOpenMap}>
        <View style={{marginBottom: Mixin.moderateSize(24)}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <AppText
              style={{
                fontSize: Mixin.moderateSize(16),
                fontWeight: 'bold',
                marginTop: Mixin.moderateSize(16),
              }}>
              {selectAgent?.name}
            </AppText>
            <AppText
              style={{
                fontSize: Mixin.moderateSize(16),
                fontWeight: 'bold',
                marginTop: Mixin.moderateSize(16),
              }}>
              {`${selectAgent?.distance} km`}
            </AppText>
          </View>
          <AppButton
            customBtnStyle={{backgroundColor: '#007AFF'}}
            title={t(translations.withdraw.googleMap)}
            icon={
              <Icon
                style={{marginRight: 4}}
                name="map"
                size={20}
                color="white"
              />
            }
            onPress={() => openMap(TYPE_MAP.NORMAL)}
          />
          <AppButton
            customBtnStyle={{backgroundColor: '#FF0000'}}
            buttonStyle={{marginTop: 12}}
            title={t(translations.withdraw.direction)}
            icon={
              <Icon
                style={{marginRight: 4}}
                name="near-me"
                size={20}
                color="white"
              />
            }
            onPress={() => openMap(TYPE_MAP.DIRECTION)}
          />
        </View>
      </Overlay>
    </View>
  );
};
