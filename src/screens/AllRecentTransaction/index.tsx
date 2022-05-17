import {images} from 'assets';
import ContactDetail from 'components/modules/ContactDetail';
import AppHeader from 'components/modules/Header';
import {HookHelper, Mixin} from 'helpers';
import {useCommon} from 'helpers/features/common';
import {useGetNavigation} from 'helpers/hookHelper';
import {useLoadingContext} from 'helpers/loadingHelper';
import {IRecentTrans} from 'models/services/IRecent';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {theme} from 'utils/styles/theme';

export const AllRecentTransaction = () => {
  const {showLoading, hideLoading} = useLoadingContext();
  const {onGetAllRecent} = useCommon();
  const {navigation, route} = useGetNavigation<'AllRecentTransaction'>();
  const onSelectItem = route.params?.onSelectItem!;
  const featureCode = route.params?.featureCode!;

  const {theme, t, translations} = HookHelper.useBaseHook();
  const [valueSearch, setValueSearch] = useState('');
  const [dataRecent, setDataRecent] = useState<IRecentTrans[]>([]);
  const [dataSearch, setDataSearch] = useState<IRecentTrans[]>([]);

  useEffect(() => {
    const getAllRecentData = async () => {
      showLoading();
      const response = await onGetAllRecent(featureCode, 'ALL');

      setDataRecent(response?.recentTrans!);
      setDataSearch(response?.recentTrans!);
      hideLoading();
    };

    getAllRecentData();
  }, []);

  const updateSearch = (search: string) => {
    setValueSearch(search);
    const searchData = dataSearch.filter(elm => {
      return (
        (elm.tplAccountCode || '').includes(search) ||
        (elm.tplName || '').includes(search)
      );
    });
    setDataRecent(searchData);
  };

  const renderItem = (item: IRecentTrans) => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
        onSelectItem(item);
      }}>
      <ContactDetail
        containerStyles={styles.contactContainer}
        isContact
        title={item.tplName || 'Natcash'}
        description={item.tplAccountCode}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AppHeader title={t(translations.transfer.recentBeneficiary)} filled />
      <View style={{padding: 16}}>
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
              onPress={() => updateSearch('')}>
              <Image source={images.iconClear} />
            </TouchableOpacity>
          ) : null}
        </View>
        <FlatList
          data={dataRecent}
          renderItem={item => renderItem(item.item)}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors?.primary,
    padding: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors?.backgroundItem,
    alignItems: 'center',
    height: Mixin.moderateSize(36),
    paddingHorizontal: 12,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 12,
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
  contactContainer: {
    marginVertical: Mixin.moderateSize(5),
    width: '100%',
  },
});
