import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {Header, HeaderProps, Icon, makeStyles} from 'react-native-elements';

interface IHeaderProps extends HeaderProps {
  title?: string;
  filled?: boolean;
  hideBack?: boolean;
  rightText?: boolean;
  onPressLeft?: () => void;
  onRightButton?: () => void;
  transparent?: boolean;
  renderRight?: Element;
}
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingHorizontal: Mixin.moderateSize(16),
    zIndex: 9999,
  },
  containerFilled: {
    backgroundColor: theme.colors?.primary,
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
  },
}));
const AppHeader = (props: IHeaderProps) => {
  const {filled, title, hideBack, transparent, onPressLeft} = props;
  const {theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <Header
      {...props}
      containerStyle={[
        styles.container,
        filled ? styles.containerFilled : null,
        transparent ? styles.containerTransparent : null,
      ]}
      rightComponent={props.renderRight ? props.renderRight : undefined}
      leftComponent={
        !hideBack ? (
          <Icon
            onPress={onPressLeft ? onPressLeft : () => navigation.goBack()}
            color={filled || transparent ? 'white' : 'black'}
            name="arrow-left"
            type="material-community"
          />
        ) : undefined
      }
      centerComponent={{
        text: title,
        style: {
          ...styles.title,
          ...(filled || transparent ? styles.titleFilled : {}),
        },
      }}
    />
  );
};
export default AppHeader;
