import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Profile, Transaction, QRScan, PromotionStack} from 'screens';
import {TabBar} from './components/Tabbar';

const Tab = createBottomTabNavigator();

export const TabRoute = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // tabBarBackground: () => (
        //   <View style={{ backgroundColor: 'transparent', width: '100%' }} />
        // ),
        tabBarStyle: {
          backgroundColor: 'red',
          position: 'absolute',
          height: 100,
        },
      }}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Promotion" component={PromotionStack.Promotion} />
      <Tab.Screen name="Scan" component={QRScan} />
      <Tab.Screen name="Transaction" component={Transaction} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
