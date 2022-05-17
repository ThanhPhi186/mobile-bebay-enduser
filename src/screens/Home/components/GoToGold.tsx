import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {Header, Icon, makeStyles} from 'react-native-elements';
import {View, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from 'components/atoms/AppText';
import {images} from 'assets';
interface IUpgradeGoldProps {
  title?: string;
  filled?: boolean;
  hideBack?: boolean;
  rightText?: boolean;
  onPressLeft?: () => void;
  onRightButton: () => void;
  isBg?: boolean;
}
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'pink',
    width: '100%',
    height: 100,
  },
  upgradeVipContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    paddingVertical: Mixin.moderateSize(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  upgradeVipLeftView: {
    width: '50%',
    height: Mixin.moderateSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Mixin.moderateSize(10),
  },
  upgradeVipRightView: {
    width: '40%',
    height: Mixin.moderateSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Mixin.moderateSize(10),
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  btpUpgrade: {
    width: Mixin.moderateSize(60),
    height: Mixin.moderateSize(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Mixin.moderateSize(20),
    backgroundColor: '#00659F',
  },
  iconGold: {
    margin: Mixin.moderateSize(8),
    width: Mixin.moderateSize(24),
    height: Mixin.moderateSize(24),
    resizeMode: 'contain',
  },
  goldText: {
    fontSize: Mixin.moderateSize(16),
    color: 'white',
    fontWeight: '600',
  },
  textBtnUpgrade: {
    fontSize: Mixin.moderateSize(16),
    fontWeight: '600',
    color: 'white',
  },
}));
const GoToGold = (props: IUpgradeGoldProps) => {
  const {filled, title, hideBack} = props;
  const {theme, t, translations, dispatch} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={
        props?.isBg
          ? ['transparent', 'transparent']
          : [theme.colors?.primary!, theme.colors?.primary!]
      }
      style={styles.upgradeVipContainer}>
      <View style={styles.upgradeVipLeftView}>
        <Image style={styles.iconGold} source={images.IconCrownWhite} />
        <AppText style={styles.goldText}>
          {t(translations.home.upgradeToGold)}
        </AppText>
      </View>
      <View style={styles.upgradeVipRightView}>
        <TouchableOpacity
          onPress={() => props.onRightButton()}
          style={styles.btpUpgrade}>
          <AppText style={styles.textBtnUpgrade}>
            {t(translations.home.go)}
          </AppText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
export default GoToGold;
