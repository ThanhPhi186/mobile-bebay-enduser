import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Container from 'components/atoms/Container';
import AppButton from 'components/atoms/Button';
import {useDispatch} from 'react-redux';
import AppHeader from 'components/modules/Header';
import {AuthenticationActions} from 'stores/actions';
import {images} from 'assets';
import AppText from 'components/atoms/AppText';
import useStyles from './styles';
import {HookHelper} from 'helpers';

export const ComingSoon = () => {
  const {theme, t, translations, dispatch} = HookHelper.useBaseHook();
  const navigation = useNavigation();
  const styles = useStyles(theme);

  return (
    <Container>
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={{width: '80%', height: 80, marginBottom: 40}}
          source={images.logo_home}
        />
        <Image
          resizeMode="cover"
          style={{width: '90%', height: 250}}
          source={images.bg_complete}
        />
        <AppText body2 style={styles.BoldText}>
          {t(translations.comingSoon.comingSoon)}
        </AppText>
        <AppText
          style={[
            styles.normalText,
            {marginHorizontal: 40, textAlign: 'center'},
          ]}>
          {t(translations.comingSoon.comingSoonTitle)}
        </AppText>
        <TouchableOpacity
          onPress={() => navigation.navigate('TabRoute')}
          style={{
            width: '40%',
            height: 40,
            backgroundColor: 'rgba(242,130,48,0.15)',
            borderRadius: 5,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppText
            body2
            style={[
              styles.normalText,
              {color: theme.colors?.primary, fontWeight: '700'},
            ]}>
            {t(translations.transfer.backToHome)}
          </AppText>
        </TouchableOpacity>
      </View>
    </Container>
  );
};
