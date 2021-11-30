import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { SxProps } from '@mui/system';

export const MUITheme = createTheme({
  mobileNavigationHeight: 80,
  desktopNavigationHeight: 80,

  palette: {
    primary: {
      main: '#004084',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    mobileNavigationHeight: number
    desktopNavigationHeight: number
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    mobileNavigationHeight: number
    desktopNavigationHeight: number
  }
}

export type SXMap = Record<string, SxProps<any>>