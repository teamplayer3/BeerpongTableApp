/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { TranslateYTransform, View, PermissionsAndroid } from 'react-native';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { BleManagerProvider } from './src/provider/BleManagerProvider';
import { PotHandlerProvider, usePotHandler } from './src/provider/PotHandlerProvider';
import { TableConnectionProvider, useTableConnection } from './src/provider/TableConnectionProvider';
import ColorSelectView from './src/view/ColorSelectView';
import { TabelBottomSide, TabelTopSide } from './src/view/TabelSide';

type SpacingArgument = number | string;

interface Spacing {
  (): number;
  (value: number): number;
  (topBottom: SpacingArgument, rightLeft: SpacingArgument): string;
  (top: SpacingArgument, rightLeft: SpacingArgument, bottom: SpacingArgument): string;
  (
    top: SpacingArgument,
    right: SpacingArgument,
    bottom: SpacingArgument,
    left: SpacingArgument
  ): string;
}

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
    }

    interface Theme {
      spacing: Spacing
    }
  }
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  spacing: (a?: any, b?: any, c?: any, d?: any): any => {
    const stdSpacing: number = 10
    if (typeof d !== 'undefined') return `${stdSpacing * a}px ${stdSpacing * b}px ${stdSpacing * c}px ${stdSpacing * d}px`
    if (typeof c !== 'undefined') return `${stdSpacing * a}px ${stdSpacing * b}px ${stdSpacing * c}px`
    if (typeof b !== 'undefined') return `${stdSpacing * a}px ${stdSpacing * b}px`
    if (typeof a !== 'undefined') return stdSpacing * a
    return stdSpacing
  },
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default function App() {

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN).then(e => e ? console.log("Has permissions") : console.log("none"))
    console.log("start")
    return () => {
      console.log("Stop")
    }
  })

  return (
    <PaperProvider theme={theme}>
      <GrantPermissions>
        <BleManagerProvider>
          <TableConnectionProvider>
            <PotHandlerProvider>
              <TestComp />
            </PotHandlerProvider>
          </TableConnectionProvider>
        </BleManagerProvider>
      </GrantPermissions>
    </PaperProvider>
  )
}

const requestBluetoothPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ]);

    console.log(granted)
  } catch (err) {
    console.warn(err);
  }
};

const GrantPermissions: React.FC<{ children: ReactNode[] | ReactNode, }> = ({ children }) => {

  let granted = useState(false)

  useEffect(() => {
    requestBluetoothPermission()
  })

  return (
    <View>
      {granted && children}
    </View>
  )
}

function TestComp() {

  const tabelConnetion = useTableConnection()

  return (
    <View>
      <ConnectionToTabel />
    </View>
  )
}

function ConnectionToTabel() {

  const tabelConnetion = useTableConnection()
  const potHandler = usePotHandler()
  useEffect(() => {

    // const pot: Pot = new Pot(0, Color.red())

    // const package_ = Package.setPotColors([pot, pot])

    // tabelConnetion.send(package_.pack())

  })


  const unselectAll = () => {
    console.log("Hall")
    // potHandler.unselectAll()
  }

  return (
    <View
      onTouchEnd={unselectAll}
      style={{
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'yellow'
      }}
    >
      <TabelTopSide />
      <TabelBottomSide />
      <View style={{
        transform: [{
          translateY: 0
        } as TranslateYTransform]
      }}>
        <ColorSelectView onClose={() => console.log("Hallo")} />
      </View>
    </View>

  )
}
