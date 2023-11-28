import * as React from 'react';
import {ActivityIndicator, View, Platform, StyleSheet, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {WebView} from 'react-native-webview';
function LoadingIndicatorView() {
  return (
    <View style={styles.loaderView}>
      <ActivityIndicator color="#009b88" size="large" />
    </View>
  );
}
StatusBar.setBackgroundColor("#fff")
export default function App() {

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{uri: 'https://wirehub.com.au/wp-login.php'}}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
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
    position: 'absolute',
    paddingTop: '50%',
    paddingLeft: '50%',
  },
});
