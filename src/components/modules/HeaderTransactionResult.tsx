import { Mixin } from 'helpers';
import { useBaseHook } from 'helpers/hookHelper';
import React, { useState, useEffect } from 'react';
import { ViewProps, Image, TouchableOpacity } from 'react-native';
import { makeStyles, OverlayProps } from 'react-native-elements';
import AppText from 'components/atoms/AppText';
import { View } from 'react-native';
import { images } from 'assets';
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: Mixin.device_height / 3,
    backgroundColor: theme.colors?.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: Mixin.moderateSize(50),
    height: Mixin.moderateSize(50),
    marginBottom: 10,
  },
  iconFavorite: {
    width: Mixin.moderateSize(15),
    height: Mixin.moderateSize(15),
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '50%',
  },
  btnFavorite: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 30,
    top: 40,
    borderRadius: 15,
  },
}));
interface IResultProps extends ViewProps {
  title: string;
  description: string;
  onPressFavorite?: () => void;
  isFavorite?: boolean;
  isCheckFavorite?: boolean;
}
const HeaderTransactionDetail = (props: IResultProps) => {
  const { theme } = useBaseHook();
  const styles = useStyles(theme);
  return (
    <View style={styles.container}>
      <Image
        resizeMode={'cover'}
        style={styles.imageBackground}
        source={images.backgroundSuccess} />
      {props.isCheckFavorite && (
        <TouchableOpacity
          onPress={() => props.onPressFavorite()}
          style={styles.btnFavorite}>
          <Image
            style={[
              styles.iconFavorite,
              { tintColor: props.isFavorite ? 'red' : theme.colors?.disabled },
            ]}
            source={images.IconFavorite}
          />
        </TouchableOpacity>
      )}
      <Image style={styles.icon} source={images.IconCheck} />
      <AppText white style={{
        fontWeight: '400',
        fontSize: Mixin.moderateSize(16),
      }}>
        {props.title}
      </AppText>
      <AppText white style={{
        fontWeight: '700',
        fontSize: Mixin.moderateSize(20),
      }}>
        {props.description}
      </AppText>
    </View>
  );
};
export default HeaderTransactionDetail;
