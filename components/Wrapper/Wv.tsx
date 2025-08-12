import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, SafeAreaView, ViewStyle } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { WebViewSourceUri } from 'react-native-webview/lib/WebViewTypes';

export const Wv = ({
  backgroundColor = '#FFF',
  style = {},
  uri = '',
}: {
  backgroundColor: ViewStyle['backgroundColor'];
  style?: SafeAreaViewProps['style'];
  uri: WebViewSourceUri['uri'];
}) => {
  const ref = useRef<WebView>(null);

  const [_, setError] = useState('');

  const handleBack = useCallback(() => {
    if (ref?.current) {
      ref.current.goBack();

      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const { remove } = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );

    return remove;
  }, [handleBack]);

  return (
    <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]}>
      <WebView
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowsInlineMediaPlayback={true}
        allowUniversalAccessFromFileURLs={true}
        androidLayerType={'none'}
        cacheEnabled={true}
        cacheMode={'LOAD_DEFAULT'}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        onError={(error) => {
          setError(JSON.stringify(error));
        }}
        onShouldStartLoadWithRequest={() => true}
        ref={ref}
        source={{ uri }}
        textZoom={100}
        thirdPartyCookiesEnabled={true}
      />
    </SafeAreaView>
  );
};
