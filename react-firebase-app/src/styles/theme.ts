import { createTheme, type ThemeOptions } from '@mui/material/styles';
// import { UI_CONFIG } from '../constants';

// Color palette based on design specification
const palette = {
  primary: {
    main: '#1976D2',
    dark: '#1565C0',
    light: '#42A5F5',
  },
  secondary: {
    main: '#DC004E',
    dark: '#C51162',
    light: '#F06292',
  },
  success: {
    main: '#4CAF50',
  },
  warning: {
    main: '#FF9800',
  },
  error: {
    main: '#F44336',
  },
  info: {
    main: '#2196F3',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    500: '#9E9E9E',
    700: '#616161',
    900: '#212121',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
};

// Typography settings
const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.3,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.4,
    textTransform: 'none' as const,
  },
};

// Component customizations
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        borderRadius: 8,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'box-shadow 0.2s ease-in-out',
        },
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.04)',
        },
      },
    },
  },
};

// Spacing (4px base unit)
const spacing = 4;

// Breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1024,
    lg: 1200,
    xl: 1536,
  },
};

// Shape (border radius)
const shape = {
  borderRadius: 8,
};

const themeOptions: ThemeOptions = {
  palette,
  typography,
  components,
  spacing,
  breakpoints,
  shape,
};

export const theme = createTheme(themeOptions);

// Dark theme (for future use)
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    ...palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
      disabled: '#666666',
    },
  },
});

export default theme;