import AppText from 'components/atoms/AppText';
import {Mixin, StringHelper} from 'helpers';
import {useAppSelector, useBaseHook} from 'helpers/hookHelper';
import React from 'react';
import {View} from 'react-native';
import {makeStyles} from 'react-native-elements';

interface IHelloLoginProps {
  description?: string;
}
const useStyles = makeStyles(theme => ({
  helloText: {
    fontWeight: '700',
    fontSize: Mixin.moderateSize(24),
  },
  helloContainer: {
    width: '100%',
    marginTop: Mixin.moderateSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloName: {
    color: theme.colors?.primary,
    fontSize: Mixin.moderateSize(18),
    fontWeight: '700',
  },
  description: {
    width: '100%',
    textAlign: 'center',
  },
}));

export const HelloLogin = (props: IHelloLoginProps) => {
  const {t, translations, theme} = useBaseHook();
  const accountNumber = useAppSelector(
    state => state.AuthenticationReducer.accountNumber,
  );
  const styles = useStyles(theme);
  return (
    <View style={styles.helloContainer}>
      <AppText style={styles.helloText}>
        {t(translations.pinCode.hello)}
      </AppText>
      <AppText style={styles.helloName}>
        {StringHelper.formatPhoneNumber(accountNumber)}
      </AppText>
      <AppText style={styles.description} body1>
        {props.description}
      </AppText>
    </View>
  );
};
