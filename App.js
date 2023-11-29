/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import { View, Platform, StyleSheet, StatusBar, BackHandler, Alert } from 'react-native';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import AnimatedLoader from 'react-native-animated-loader';
import { WebView } from 'react-native-webview';

StatusBar.setBackgroundColor('#fff');
export default function App({ navigation }) {
  const WEBVIEW_REF = React.useRef(null)
  const [visible, setVisible] = React.useState(true);
  const [canGoBack, setCanGoBack] = React.useState(false);

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('b7b5efad-787e-4158-8da3-8af9ffb27f1f');
  OneSignal.Notifications.requestPermission(true);
  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  function LoadingIndicatorView() {
    return (
      <View style={styles.loaderView}>
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255, 0)"
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

  const setupState = event => {
    setCanGoBack(event?.canGoBack);
  };

  React.useEffect(() => {
    const goBack = () => {
      if (canGoBack === false) {
        Alert.alert(
          'Exit App',
          'Do you want to exit app?',
          [
            {text: 'No', onPress: () => console.log('No'), style: 'cancel'},
            {text: 'Yes', onPress: () => BackHandler?.exitApp()},
          ],
          {cancelable: false},
        );
      }
      WEBVIEW_REF?.current?.goBack();
      return true;
    };

    BackHandler?.addEventListener('hardwareBackPress', () => goBack());

    return () =>
      BackHandler?.removeEventListener('hardwareBackPress', () => goBack());
  }, [canGoBack]);

  return (
    <View style={styles.container}>
      <WebView
        ref={WEBVIEW_REF}
        originWhitelist={['*']}
        source={{ uri: 'https://wirehub.com.au/wp-login.php' }}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
        onLoadEnd={() => setVisible(false)}
        // cacheEnabled={web.cacheEnabled}
        automaticallyAdjustContentInsets={false}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode={"LOAD_CACHE_ELSE_NETWORK"}
        allowsInlineMediaPlayback={true}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        pullToRefreshEnabled={true}
        onNavigationStateChange={e => setupState(e)}
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
