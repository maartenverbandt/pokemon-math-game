import {
    createMuiTheme,
    createStyles,
    makeStyles
  } from '@material-ui/core';
  import { red, yellow } from '@material-ui/core/colors';
  
  const defaultTheme = createMuiTheme({
    palette: {
      primary: { main: '#0099CC' },
      secondary: { main: '#005470' }
    }
  });
  
  const sideBarTheme = createMuiTheme({
    palette: {
      primary: { main: '#034151' },
      secondary: { main: '#0099CC' },
      background: { default: '#F5F5F5' }
    }
  });
  
  const useStyles = makeStyles((theme) =>
    createStyles({
      warning: {
        color: theme.palette.getContrastText(yellow[600]),
        backgroundColor: yellow[600],
        '&:hover': {
          backgroundColor: yellow[800]
        }
      },
      error: {
        color: theme.palette.getContrastText(red[600]),
        backgroundColor: red[600],
        '&:hover': {
          backgroundColor: red[800]
        }
      }
    })
  );
  
  export { defaultTheme, sideBarTheme, useStyles };
  