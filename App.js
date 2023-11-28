/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {View, Platform, StyleSheet, StatusBar} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import AnimatedLoader from 'react-native-animated-loader';
import {WebView} from 'react-native-webview';

StatusBar.setBackgroundColor('#fff');
export default function App() {
  const [visible, setVisible] = React.useState(true);

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('b7b5efad-787e-4158-8da3-8af9ffb27f1f');

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  function LoadingIndicatorView() {
    return (
      <View style={styles.loaderView}>
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('./assets/Loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
      </View>
    );
  }

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{uri: 'https://wirehub.com.au/wp-login.php'}}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
        // onLoadStart={() => setVisible(true)}
        onLoadEnd={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  loaderView: {
    paddingTop: 200,
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    marginBottom: 40,
    height: 100,
    width: 100,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
