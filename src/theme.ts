import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#03A9F4',     // Primary Blue
    primaryContainer: '#B3E5FC', // Light Primary Blue
    background: '#FFFFFF',  // Pure white background
    surface: '#FFFFFF',
    outline: '#BDBDBD',     // Divider Grey
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: '#F5F5F5',    // Minimal elevated card background
    }
  },
};
