import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import {HookHelper, Mixin} from 'helpers';
import {IRecentTrans} from 'models/services/IRecent';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from 'utils/styles/theme';
import ContactDetail from './ContactDetail';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from './Header';

interface ModalRecentProps {
  isVisible: boolean;
  onRequestClose?: () => void;
  data: IRecentTrans[];
  onSelectItem: (item: IRecentTrans) => void;
}

const ModalRecent = (props: ModalRecentProps) => {
  const {isVisible, onRequestClose, data, onSelectItem} = props;
  const {theme, t, translations} = HookHelper.useBaseHook();
  const [valueSearch, setValueSearch] = useState('');
  const [dataRecent, setDataRecent] = useState<IRecentTrans[]>([]);
  const [dataSearch, setDataSearch] = useState<IRecentTrans[]>([]);

  useEffect(() => {
    setDataRecent(data);
    setDataSearch(data);
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
    <TouchableOpacity key={Math.random()} onPress={() => onSelectItem(item)}>
      <ContactDetail
        containerStyles={styles.contactContainer}
        isContact
        title={item.tplName || 'Natcash'}
        description={item.tplAccountCode}
      />
    </TouchableOpacity>
  );

  return (
    <Overlay
      animationType="slide"
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      overlayStyle={styles.overlay}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <AppHeader
          title={t(translations.topUp.topUp)}
          filled
          onPressLeft={onRequestClose}
        />
        <View style={{padding: 16}}>
          <View style={styles.searchContainer}>
            <Image source={images.iconSearchService} />
            <TextInput
              style={styles.inputContainer}
              placeholder={'Search'}
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
            keyExtractor={index => index.toString()}
          />
        </View>
      </View>
    </Overlay>
  );
};

export default ModalRecent;

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
