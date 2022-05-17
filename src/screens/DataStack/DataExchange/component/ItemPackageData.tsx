import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useAppSelector} from 'helpers/hookHelper';
import {IPackageData} from 'models/services/IData';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {theme} from 'utils/styles/theme';

interface IPackageDataProps {
  item: IPackageData;
  onPress: () => void;
}

const ItemPackageData = (props: IPackageDataProps) => {
  const {item, onPress} = props;

  const languageReducer = useAppSelector(state => state.LanguageReducer);

  const renderIcon = () => {
    switch (item.groupDataId) {
      case 1:
        return images.iconServicePayment;
      case 2:
        return images.iconData;
      case 3:
        return images.icon_phone;
      default:
        return images.iconData;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.rowCenter}>
        <Image style={styles.icon} source={renderIcon()} />
        <View style={{flex: 1}}>
          <AppText style={{width: '100%'}} h6>
            {item.shortName}
          </AppText>
          <AppText numberOfLines={1} style={styles.subTitle}>
            {item.subTitle}
          </AppText>
        </View>
      </View>

      <AppText style={styles.description}>{item.description}</AppText>
    </TouchableOpacity>
  );
};

export default ItemPackageData;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: Mixin.moderateSize(16),
    borderRadius: 18,
    marginTop: Mixin.moderateSize(8),
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContent: {
    backgroundColor: '#F4F4F4',
    ...Mixin.padding(16, 8, 16, 8),
    marginRight: Mixin.moderateSize(8),
    borderRadius: 12,
  },
  namePackage: {
    fontWeight: 'bold',
    color: '#1472C9',
    fontSize: Mixin.moderateSize(14),
  },
  subTitle: {
    fontWeight: 'bold',
    color: theme.colors?.primary,
    marginTop: 6,
    flex: 1,
  },
  description: {
    marginTop: 8,
    color: '#84888D',
  },
  icon: {
    width: Mixin.moderateSize(49),
    height: Mixin.moderateSize(49),
    marginRight: Mixin.moderateSize(8),
  },
});
