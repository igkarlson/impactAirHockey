import { SettingsProvider } from '@/context/SettingsContext'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useColorScheme } from '@/hooks/useColorScheme'
import './i18n'
import { Wrapper } from '@/components/Wrapper'

function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  })

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen
              name='index'
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='profile'
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='gameplay'
              options={{ headerShown: false }}
            />
            <Stack.Screen name='+not-found' />
          </Stack>
          <StatusBar style='auto' />
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  )
}

export default Wrapper(RootLayout, {
  api: 'https://api.speedy-air-hockey.online/sayhi',
  apiResponseKey: 'hi',
  backgroundColor: '#0b191e',
  whiteListIso2: ['es'],
})
