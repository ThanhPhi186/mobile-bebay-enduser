import AppText from 'components/atoms/AppText';
import {Mixin} from 'helpers';
import {useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {View, ViewProps, StyleProp, ViewStyle} from 'react-native';
import {Icon, makeStyles} from 'react-native-elements';

interface IErrorMessageProps extends ViewProps {
  message: string;
  protected?: boolean;
  errorStyle?: StyleProp<ViewStyle>;
}
const useStyles = makeStyles(theme => ({
  wrongText: {
    color: theme.colors?.error,
    marginLeft: Mixin.moderateSize(8),
    width: '100%',
    marginTop: 2,
    flex: 1,
    flexWrap: 'wrap',
  },
  wrongContainer: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors?.error,
    backgroundColor: '#FFE7E7',
    flexDirection: 'row',
    marginTop: Mixin.moderateSize(16),
    padding: Mixin.moderateSize(8),
  },
}));
export const ErrorMessage = (props: IErrorMessageProps) => {
  const {theme} = useBaseHook();
  const styles = useStyles(theme);
  return (
    <View style={[styles.wrongContainer, props.errorStyle]}>
      <Icon
        name={props.protected ? 'shield-alert' : 'alert-circle'}
        color={theme.colors?.error}
      />
      <AppText style={styles.wrongText}>{props.message}</AppText>
    </View>
  );
};
