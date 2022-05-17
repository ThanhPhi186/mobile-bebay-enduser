import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {RouteParamList} from './RouteParamList';
import {LoginStack, RegisterStack} from 'screens';
import {useAppSelector} from 'helpers/hookHelper';
import {TabRoute} from './TabRoute';

const Stack = createNativeStackNavigator<RouteParamList>();

export const AuthenticationRoute = () => {
  const authenticationReducer = useAppSelector(
    state => state.AuthenticationReducer,
  );
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          authenticationReducer.onBoarded ? 'Login' : 'SelectLanguage'
        }
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="SelectLanguage"
          component={LoginStack.SelectLanguage}
        />
        <Stack.Screen
          name="OnBoardingScreen"
          component={LoginStack.OnBoardingScreen}
        />
        <Stack.Screen name="Login" component={LoginStack.Login} />
        <Stack.Screen name="PinCode" component={LoginStack.PinCode} />
        <Stack.Screen name="OTPLogin" component={LoginStack.OTPLogin} />
        <Stack.Screen name="TermsOfUse" component={RegisterStack.TermsOfUse} />
        <Stack.Screen name="Register" component={RegisterStack.Register} />
        <Stack.Screen name="ConfirmRegister" component={RegisterStack.ConfirmRegister} />
        <Stack.Screen name="RegisterResult" component={RegisterStack.RegisterResult} />
        <Stack.Screen name="TabRoute" component={TabRoute} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
