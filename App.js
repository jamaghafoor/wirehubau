import * as React from 'react';
import {ActivityIndicator, View, Platform, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
function LoadingIndicatorView() {
  return (
    <View style={styles.loaderView}>
      <ActivityIndicator color="#009b88" size="large" />
    </View>
  );
}
export default function App() {
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
