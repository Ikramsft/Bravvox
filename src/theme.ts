import {extendTheme} from 'native-base';
import {DefaultTheme} from '@react-navigation/native';

export const theme = extendTheme({
  useSystemColorMode: true,
  fontConfig: {
    DMSans: {
      100: {
        normal: 'DMSans-Regular',
        italic: 'DMSans-Italic',
      },
      200: {
        normal: 'DMSans-Regular',
        italic: 'DMSans-Italic',
      },
      300: {
        normal: 'DMSans-Regular',
        italic: 'DMSans-Italic',
      },
      400: {
        normal: 'DMSans-Regular',
        italic: 'DMSans-Italic',
      },
      500: {
        normal: 'DMSans-Medium',
        italic: 'DMSans-MediumItalic',
      },
      600: {
        normal: 'DMSans-Medium',
        italic: 'DMSans-MediumItalic',
      },
      700: {
        normal: 'DMSans-Bold',
        italic: 'DMSans-BoldItalic',
      },
      800: {
        normal: 'DMSans-Bold',
        italic: 'DMSans-BoldItalic',
      },
      900: {
        normal: 'DMSans-Bold',
        italic: 'DMSans-BoldItalic',
      },
    },
  },
  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: 'DMSans',
    body: 'DMSans',
    mono: 'DMSans',
  },
  colors: {
    primary: {
      50: '#d9f7ff',
      100: '#ace1ff',
      200: '#7cccff',
      300: '#49b7ff',
      400: '#1aa2ff',
      500: '#0089e6',
      600: '#006ab4',
      700: '#004c82',
      800: '#002e51',
      900: '#001021',
      1000: '#DE5B57',
    },
    black: {
      40: '#000000',
      50: '#E5E5E5',
      100: '#BABABA',
      200: '#e8e8e8',
      300: '#A4A4A4',
      400: '#959699',
      500: '#818488',
      600: '#25262A',
      700: '#333',
      800: '#ccc',
      850: '#2C2C2C',
      900: '#26323F',
      950: '#231F20',
      1000: '#26323F',
    },
    red: {
      600: '#DF5664',
      700: '#DF5A56',
      800: '#dc3545',
      900: '#DF5A56',
    },
    gray: {
      100: '#EDEEEE',
      200: '#969596',
      300: '#a1a1a1',
      400: '#A9A9A9',
      500: '#d3d3d3',
      600: '#5A6078',
      700: '#313534',
      800: '#DEDEDE',
      900: '#6c757d',
    },
    appWhite: {
      400: '#E7E7E7',
      500: '#EBEBEB',
      600: '#FFFFFF',
      700: '#f9f9f9',
    },
    blue: {
      500: '#2396f3',
      600: '#49658c',
      700: '#90B9FE',
      800: '#0d6efd',
    },
    purple: {
      500: '#A9ACBA',
    },
    transparentGray: {
      100: 'rgba(90, 90, 90,0.8)',
    },
    transparentBlack: {
      100: 'rgba(0, 0, 0, 0.6)',
    },
    transparentWhite: {
      100: 'rgba(255, 255, 255, 0.8)',
    },
  },
  config: {
    initialColorMode: 'light',
  },
});

export const navTheme = {
  light: {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: '#86b7fe',
    },
  },
  dark: {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: '#86b7fe',
      background: '#000',
      card: '#000',
      text: '#fff',
      border: '#fff',
      notification: '#fff',
    },
  },
};

type CustomThemeType = typeof theme;

declare module 'native-base' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ICustomTheme extends CustomThemeType {}
}
