import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    google: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    google?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    google: true;
  }
}

const themeOptions = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#db3131',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#1890ff',
    },
    google: {
      main: '#EA4335',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fafafa',
      contrastText: '#3A3B3F',
    },
  },
  typography: {
    fontFamily: ['Public Sans, Roboto'].join(','),
  },
});

export default themeOptions;
