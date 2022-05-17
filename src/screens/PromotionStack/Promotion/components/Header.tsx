import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {HeaderProps, Icon, makeStyles} from 'react-native-elements';
import {View, SafeAreaView} from 'react-native';
import AppText from 'components/atoms/AppText';

interface IHeaderProps extends HeaderProps {
  title?: string;
  filled?: boolean;
  hideBack?: boolean;
  rightText?: boolean;
  onPressLeft?: () => void;
  onRightButton?: () => void;
  transparent?: boolean;
}
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.primary,
    borderBottomWidth: 0,
    paddingHorizontal: Mixin.moderateSize(16),
    zIndex: 9999,
  },
  containerTransparent: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: Mixin.moderateSize(16),
    fontWeight: '600',
  },
  titleFilled: {
    color: 'white',
    fontWeight: '700',
    fontSize: Mixin.moderateSize(16),
  },
  viewLeft: {
    width: '14%',
    height: 45,
    justifyContent: 'center',
  },
  viewCenter: {
    width: '50%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    // backgroundColor:'green'
  },
  viewRight: {
    width: '35%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'pink'
  },
}));
const Header = (props: IHeaderProps) => {
  const {filled, title, hideBack, transparent} = props;
  const {theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <SafeAreaView {...props} style={[styles.container]}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
          },
          {justifyContent: props.rightComponent ? 'space-between' : 'center'},
        ]}>
        {!hideBack ? (
          <View style={styles.viewLeft}>
            {!hideBack ? (
              <Icon
                onPress={() => navigation.goBack()}
                color={'white'}
                name="arrow-left"
                type="material-community"
              />
            ) : undefined}
          </View>
        ) : null}
        <View style={styles.viewCenter}>
          <AppText style={styles.titleFilled}>{title}</AppText>
        </View>
        {props.rightComponent ? (
          <View style={styles.viewRight}>{props.rightComponent}</View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
export default Header;
