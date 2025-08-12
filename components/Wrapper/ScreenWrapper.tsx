import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

export const ScreenWrapper = ({
  backgroundColor = '#FFF',
  children,
}: {
  backgroundColor: ViewStyle['backgroundColor'];
  children: ReactNode;
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor,
        flex: 1,
        gap: 16,
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
};
