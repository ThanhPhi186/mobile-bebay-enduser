import {Mixin} from 'helpers';
import {useBaseHook, useGetNavigation} from 'helpers/hookHelper';
import React from 'react';
import {Header, Icon, makeStyles} from 'react-native-elements';

interface IHeaderProps {
  title?: string;
  filled?: boolean;
  hideBack?: boolean;
  rightText?: boolean;
  onPressLeft?: () => void;
  onRightButton?: () => void;
}
const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    paddingHorizontal: Mixin.moderateSize(16),
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
}));
const RegisterHeader = (props: IHeaderProps) => {
  const {filled, title, hideBack} = props;
  const {theme} = useBaseHook();
  const {navigation} = useGetNavigation();
  const styles = useStyles(theme);
  return (
    <Header
      containerStyle={styles.container}
      leftComponent={
        !hideBack ? (
          <Icon
            onPress={() => navigation.goBack()}
            color={filled ? 'black' :'white'}
            name="arrow-left"
            type="material-community"
          />
        ) : undefined
      }
      centerComponent={{
        text: title,
        style: {
          ...styles.title,
          ...(filled ? styles.titleFilled : {}),
        },
      }}/>
  );
};
export default RegisterHeader;
