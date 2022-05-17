import { Mixin } from 'helpers';
import { useBaseHook, useGetNavigation } from 'helpers/hookHelper';
import React from 'react';
import { Header, Icon, makeStyles } from 'react-native-elements';
import { View } from 'react-native';
import GoToGold from '../../Home/components/GoToGold';
import AppText from 'components/atoms/AppText';
import LinearGradient from 'react-native-linear-gradient';
interface IUpgradeGoldProps {
  title?: string;
  filled?: boolean;
  hideBack?: boolean;
  rightText?: boolean;
  onPressLeft?: () => void;
  onRightButton: () => void;
}
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#031B5A',
    width: '100%',
    borderRadius: Mixin.moderateSize(10),
    padding: Mixin.moderateSize(10),
    marginTop: Mixin.moderateSize(20),
  },
  containerFilled: {
    backgroundColor: theme.colors?.primary,
  },
  title: {
    fontSize: Mixin.moderateSize(16),
    fontWeight: '600',
    color: 'white',
  },
  titleFilled: {
    color: 'black',
  },
  txtDescription: {
    marginHorizontal: Mixin.moderateSize(60),
    color: theme.colors?.white,
    fontSize: Mixin.moderateSize(12),
  }
}));
const UpgradeGold = (props: IUpgradeGoldProps) => {
  const { filled, title, hideBack } = props;
  const { theme, t, translations } = useBaseHook();
  const { navigation } = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={['#031B5A', '#00659F']}
      style={styles.container}>
      <GoToGold onRightButton={() => props.onRightButton()} isBg />
      <AppText style={styles.txtDescription}>{t(translations.register.updateGoldDescription)}</AppText>
    </LinearGradient>
  );
};
export default UpgradeGold;
