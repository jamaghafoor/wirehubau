/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import messaging from '@react-native-firebase/messaging';
import MainView from './MainView';
import NotificationView from './NotificationsView';
import { Linking } from 'react-native';


const Stack = createNativeStackNavigator();

export default function App() {


  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // OneSignal Initialization
  OneSignal.initialize('15028df0-0a11-4a8c-801a-f749e84689d0');
  OneSignal.Notifications.requestPermission(true);
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });


const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      NotificationView: 'NotificationView',
    },
  }
}


  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);


  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainView}/>
        <Stack.Screen name="NotificationView" component={NotificationView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}