/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {useEffect, useState} from 'react';
import {StatusBar, LogBox, Text, TextInput, useColorScheme} from 'react-native';
import {ColorMode, NativeBaseProvider, StorageManager} from 'native-base';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider as StoreProvider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import * as Sentry from '@sentry/react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PersistGate} from 'redux-persist/integration/react';
/* removed due to keyboard issues */
// import KeyboardManager from 'react-native-keyboard-manager';
import AsyncStorage from '@react-native-community/async-storage';
import NavContainer from './src/navigation';
import {theme} from './src/theme';
import {ConfirmModalProvider} from './src/components/CofirmationModel';
import {persistor, store} from './src/redux/store';
import ImageGallery from './src/components/ImageGallery';

import UpdateDialog from './src/components/UpdateDialog';
import {SocketProvider} from './src/socket';
import {COLOR_MODE_KEY} from './src/constants/common';
// NOTE: hiding warnings about color contrasts
LogBox.ignoreLogs(['NativeBase: The contrast ratio of']);

const queryClient = new QueryClient();

interface TextWithDefaultProps extends Text {
  defaultProps?: {allowFontScaling?: boolean};
}

interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: {allowFontScaling?: boolean};
}

function App(): JSX.Element {
  const systemTheme = useColorScheme();

  const colorModeManager: StorageManager = {
    get: async () => {
      try {
        const val = await AsyncStorage.getItem(COLOR_MODE_KEY);
        const mode = val === 'systemDefault' ? systemTheme : val === 'dark' ? 'dark' : 'light';
        StatusBar.setBarStyle(mode === 'dark' ? 'light-content' : 'dark-content', true);
        return mode;
      } catch (e) {
        return systemTheme;
      }
    },
    set: async (value: ColorMode) => {
      if (value) {
        await AsyncStorage.setItem(COLOR_MODE_KEY, value);
      }
    },
  };

  const [showUpdate, setShowUpdate] = useState<boolean>(false);

  const toggleShowUpdate = () => setShowUpdate(v => !v);

  useEffect(() => {
    disableScaling();
    /* removed due to keyboard issues */
    // if (Platform.OS === 'ios') {
    //   KeyboardManager.setEnable(true);
    //   KeyboardManager.setEnableAutoToolbar(false);
    // }

    Sentry.init({
      dsn: 'https://66bcb07b3b434880a9445fbf8af6734c@o1162912.ingest.sentry.io/6250507',
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
      enableOutOfMemoryTracking: false,
    });
  }, []);

  const disableScaling = () => {
    (Text as unknown as TextWithDefaultProps).defaultProps =
      (Text as unknown as TextWithDefaultProps).defaultProps || {};
    (Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling = false;
    (TextInput as unknown as TextInputWithDefaultProps).defaultProps =
      (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
    (TextInput as unknown as TextInputWithDefaultProps).defaultProps!.allowFontScaling = false;
  };

  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <StatusBar barStyle="dark-content" />
          <SafeAreaProvider>
            <NativeBaseProvider colorModeManager={colorModeManager} theme={theme}>
              <ConfirmModalProvider>
                <StatusBar translucent backgroundColor="transparent" />
                <SocketProvider>
                  <NavContainer />
                </SocketProvider>
                <ImageGallery />
                {showUpdate ? <UpdateDialog /> : null}
              </ConfirmModalProvider>
            </NativeBaseProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
      <FlashMessage position="top" statusBarHeight={StatusBar.currentHeight} />
    </StoreProvider>
  );
}

export default Sentry.wrap(App);
