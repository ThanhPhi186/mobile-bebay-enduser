import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/core';
import {images} from 'assets';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {ListService} from '../Home/components/ListService';
import {HookHelper} from 'helpers';
import {useGetNavigation} from 'helpers/hookHelper';
import {PaymentServiceList} from 'models/IServices';

const HEIGHT_STATUS_BAR = getStatusBarHeight();

export const SearchService = () => {
  const {theme, t, translations} = HookHelper.useBaseHook();
  const {navigation} = useGetNavigation();
  const [listService, setListService] = useState([]);
  const [valueSearch, setValueSearch] = useState('');
  const [listSearchServices, setListSearchServices] = useState([]);

  useEffect(() => {
    setListSearchServices(PaymentServiceList);
    setListService(PaymentServiceList);
  }, []);
  const searchService = (text: string) => {
    setValueSearch(text);
    const dataSearch = listService.filter(item => {
      const itemData = item.title.toUpperCase();
      return itemData.indexOf(text.toUpperCase()) > -1;
    });

    setListSearchServices(dataSearch);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        colors={[theme.colors?.primary!, theme.colors?.primary!]}
        style={{borderBottomLeftRadius: 18, borderBottomRightRadius: 18}}>
        <View style={{height: HEIGHT_STATUS_BAR}} />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Image source={images.iconSearchService} />
            <TextInput
              style={styles.inputContainer}
              placeholder={t(translations.home.search)}
              placeholderTextColor="#545456"
              value={valueSearch}
              onChangeText={text => searchService(text)}
            />
            {valueSearch ? (
              <TouchableOpacity onPress={() => setValueSearch('')}>
                <Image source={images.iconClear} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </LinearGradient>
      <View style={styles.viewBottomHeader} />
      <View style={{backgroundColor: '#EEF0F4', padding: 12}}>
        <Text style={{fontWeight: 'bold'}}>
          {t(translations.home.listService)}
        </Text>
      </View>
      <ListService data={listSearchServices} />
    </View>
  );
};
