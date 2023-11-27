import * as React from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
function LoadingIndicatorView() {
  return (
    <View style={{position: 'absolute', paddingTop: "50%", paddingLeft: "50%"}}>
      <ActivityIndicator color='#009b88' size='large' />
    </View>
  )

}
export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? 50 : 0}}>
    <WebView
      originWhitelist={['*']}
      source={{ uri: "https://wirehub.com.au/wp-login.php" }}
      renderLoading={LoadingIndicatorView}
      startInLoadingState={true}
    />
    </View>
  );
}