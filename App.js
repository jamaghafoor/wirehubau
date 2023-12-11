/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import AnimatedLoader from 'react-native-animated-loader';
import {WebView} from 'react-native-webview';

const windowHeight = Dimensions.get('window').height;

const heightPercentage = value => {
  return (windowHeight / 100) * value;
};

const INJECTED_JS = `
  window.onscroll = function() {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      }),     
    )
  }
`

export default function App({navigation}) {
  const WEBVIEW_REF = React.useRef(null);
  const [visible, setVisible] = React.useState(true);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [scrollViewHeight, setScrollViewHeight] = React.useState(0);
  const [ isPullToRefreshEnabled, setIsPullToRefreshEnabled ] = React.useState(false)

  // console.log("Scroll Position: ", scrollPosition)

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('15028df0-0a11-4a8c-801a-f749e84689d0');
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      WEBVIEW_REF?.current?.reload();
      setRefreshing(false);
    }, 2000);
  }, []);

  const getscrollposition = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    console.log("Natove evrnent: ", e)
    // setScrollPosition(y);
  };

  const onWebViewMessage = e => {
    const { data } = e.nativeEvent
    try {
      const { scrollTop } = JSON.parse(data)
      setIsPullToRefreshEnabled(scrollTop === 0)
    } catch (error) {}
  }

  const WEBVIEW = (height) => ({
    width: "100%",
    height,
  })

  return (
    <ScrollView
      style={styles.container}
      // onScroll={getscrollposition}
      // onMomentumScrollEnd={getscrollposition}
      // scrollEventThrottle={16}
      onLayout={e => setScrollViewHeight(e.nativeEvent.layout.height)}
      refreshControl={
        <RefreshControl
          refreshing={false}
          enabled={isPullToRefreshEnabled}
          onRefresh={onRefresh}
          tintColor="transparent"
          colors={["transparent"]}
          style={{ backgroundColor: "transparent" }}
        />
      }>
      {/* <View style={{flex: 1}}> */}
      <WebView
        style={WEBVIEW(scrollViewHeight)}
        ref={WEBVIEW_REF}
        originWhitelist={['*']}
        source={{uri: 'https://wirehub.com.au/news-feed/'}}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
        onLoadEnd={() => setVisible(false)}
        // cacheEnabled={web.cacheEnabled}
        automaticallyAdjustContentInsets={false}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
        allowsInlineMediaPlayback={true}
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        pullToRefreshEnabled={true}
        onNavigationStateChange={e => setupState(e)}
        mediaPlaybackRequiresUserAction={false}
        allowFileAccess={true}
        useWebKit={true}
        injectedJavaScript={INJECTED_JS}
        showsHorizontalScrollIndicator={false}
        onMessage={onWebViewMessage}
        showsVerticalScrollIndicator={false}
        onError={syntheticEvent =>
          Alert.alert('Something went wrong. Please try reloading')
        }
      />
      {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    height: "100%",
    // paddingTop: Platform.OS === 'ios' ? 50 : 0,
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
