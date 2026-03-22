import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { theme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import RecordingScreen from './src/screens/RecordingScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import { SessionLog } from './src/services/storageService';

export type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
  Review: { initialLogData: SessionLog };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: '#000',
              headerShadowVisible: false, // minimalist design
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Judo Flow' }}
            />
            <Stack.Screen
              name="Recording"
              component={RecordingScreen}
              options={{
                title: 'Log Session',
                presentation: 'modal' // Slides up from bottom
              }}
            />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{
                title: 'Confirm Log',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
