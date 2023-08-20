import { PortalProvider } from '@gorhom/portal';
import React, { ReactNode, useEffect, useState } from 'react';
import { View, PermissionsAndroid, LogBox } from 'react-native';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Route, Router } from './src/components/Router';
import { BleManagerProvider } from './src/provider/BleManagerProvider';
import { PlayerStoreProvider } from './src/provider/PlayerStoreProvider';
import { PotHandlerProvider } from './src/provider/PotHandlerProvider';
import { TableConnectionProvider } from './src/provider/TableConnectionProvider';
import Root from './src/Root';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

type SpacingArgument = number | string;

interface Spacing {
  (): number;
  (value: number): number;
  (topBottom: SpacingArgument, rightLeft: SpacingArgument): string;
  (
    top: SpacingArgument,
    rightLeft: SpacingArgument,
    bottom: SpacingArgument,
  ): string;
  (
    top: SpacingArgument,
    right: SpacingArgument,
    bottom: SpacingArgument,
    left: SpacingArgument,
  ): string;
}

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {}

    interface Theme {
      spacing: Spacing;
    }
  }
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  spacing: (a?: any, b?: any, c?: any, d?: any): any => {
    const stdSpacing: number = 10;
    if (typeof d !== 'undefined')
      return `${stdSpacing * a}px ${stdSpacing * b}px ${stdSpacing * c}px ${
        stdSpacing * d
      }px`;
    if (typeof c !== 'undefined')
      return `${stdSpacing * a}px ${stdSpacing * b}px ${stdSpacing * c}px`;
    if (typeof b !== 'undefined')
      return `${stdSpacing * a}px ${stdSpacing * b}px`;
    if (typeof a !== 'undefined') return stdSpacing * a;
    return stdSpacing;
  },
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
    background: 'black',
  },
};

export default function App() {
  useEffect(() => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ).then(e => (e ? console.log('Has permissions') : console.log('none')));
    return () => {};
  }, []);

  return (
    <PaperProvider theme={theme}>
      <GrantPermissions>
        <BleManagerProvider>
          <TableConnectionProvider>
            <PotHandlerProvider>
              <PortalProvider>
                <PlayerStoreProvider>
                  <Router.Provider defaultRoute={Route.InGame}>
                    <Root />
                  </Router.Provider>
                </PlayerStoreProvider>
              </PortalProvider>
            </PotHandlerProvider>
          </TableConnectionProvider>
        </BleManagerProvider>
      </GrantPermissions>
    </PaperProvider>
  );
}

const requestBluetoothPermission = async () => {
  try {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
  } catch (err) {
    console.warn(err);
  }
};

const GrantPermissions = (props: { children: ReactNode[] | ReactNode }) => {
  let granted = useState(false);

  useEffect(() => {
    requestBluetoothPermission();
  });

  return <View>{granted && props.children}</View>;
};
