import * as Device from 'expo-device';
import { addNetworkStateListener } from 'expo-network';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { INITIAL_STATE } from './constants';
import { isValidURL } from './functions';
import { ScreenWrapper } from './ScreenWrapper';
import { wrapperStyles } from './styles';
import { AppState, Config } from './types';
import { useBlockedByCountry } from './useBlockedByCountry';
import { Wv } from './Wv';

interface ApiDataContextType {
  apiData?: string;
}

const ApiDataContext = createContext<ApiDataContextType>({});

export const useApiData = () => {
  const context = useContext(ApiDataContext);
  if (context === undefined) {
    throw new Error('useApiData must be used within a Wrapper');
  }
  return context;
};

export const Wrapper = (AppComponent: React.ComponentType, config: Config) => {
  const Wrapped = () => {
    const {
      api,
      apiResponseKey,
      backgroundColor,
      blackListIso2 = [],
      onHide,
      whiteListIso2 = [],
    } = config;

    const [state, setState] = useState<AppState>(INITIAL_STATE);
    const [contextValue, setContextValue] = useState<ApiDataContextType>({
      apiData: undefined,
    });

    const isBlockedByCountry = useBlockedByCountry(
      whiteListIso2,
      blackListIso2,
    );

    useEffect(() => {
      setContextValue({ apiData: state.apiData });
    }, [state.apiData]);

    useEffect(() => {
      const { remove } = addNetworkStateListener(({ isInternetReachable }) => {
        setState((prev) => ({
          ...prev,
          isConnected: isInternetReachable ?? false,
        }));
      });

      onHide?.();

      return remove;
    }, []);

    useEffect(() => {
      if (!Device.isDevice || isBlockedByCountry || !state.isConnected) {
        setState((prev) => ({ ...prev, isWv: false }));

        return;
      }

      const fetchData = async () => {
        try {
          setState((prev) => {
            return { ...prev, isLoading: true };
          });

          const response = await fetch(api);

          const result = await response.json();

          setState((prev) => {
            return { ...prev, apiData: result[apiResponseKey] };
          });
        } catch (_) {
        } finally {
          setState((prev) => {
            return { ...prev, isLoading: false };
          });
        }
      };

      fetchData();
    }, [api, isBlockedByCountry, state.isConnected]);

    useEffect(() => {
      if (state.apiData) {
        if (isValidURL(state.apiData)) {
          setState((prev) => ({ ...prev, isWv: true }));
        } else {
          setState((prev) => ({ ...prev, isWv: false }));
        }
      }
    }, [state.apiData]);

    if (!state.isConnected) {
      return (
        <ScreenWrapper backgroundColor={backgroundColor}>
          <Text style={{ color: '#000', fontSize: 32, textAlign: 'center' }}>
            {'NO INTERNET'}
          </Text>
        </ScreenWrapper>
      );
    }

    if (state.isLoading) {
      return (
        <ScreenWrapper backgroundColor={backgroundColor}>
          <Text style={{ color: '#000', fontSize: 32, textAlign: 'center' }}>
            {'Loading...'}
          </Text>
          <ActivityIndicator color={'#000'} size={'large'} />
        </ScreenWrapper>
      );
    }

    const wvStyles = state.isWv
      ? wrapperStyles.wvShown
      : wrapperStyles.wvHidden;

    const appStyles = state.isWv
      ? wrapperStyles.appHidden
      : wrapperStyles.appShown;

    return (
      <ApiDataContext.Provider value={contextValue}>
        <View style={{ flex: 1 }}>
          <Wv
            backgroundColor={backgroundColor}
            style={wvStyles}
            uri={state.apiData}
          />
          <View style={appStyles}>
            <AppComponent />
          </View>
        </View>
      </ApiDataContext.Provider>
    );
  };

  Wrapped.displayName = 'Wrapped';

  return Wrapped;
};
