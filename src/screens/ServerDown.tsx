import {images} from 'assets';
import Container from 'components/atoms/Container';
import React from 'react';
import {View} from 'react-native';
import {Image} from 'react-native-elements';
import {theme} from 'utils/styles/theme';
import AppText from 'components/atoms/AppText';

export const ServerDown = () => {
  return (
    <Container scrollEnabled={false}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors?.primary,
          width: '100%',
          padding: 20,
        }}>
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{width: 250, height: 50}}
        />
        <AppText style={{textAlign: 'center', marginTop: 24}} body1 white>
          Our services are updating, please try again later
        </AppText>
      </View>
    </Container>
  );
};
