import React from 'react';
import {
  Box,
  ThemeProvider,
} from '@material-ui/core';
import { sideBarTheme } from '../themes';

const TopBarLayout = ({ height, children }) => {
    return (
      <ThemeProvider theme={sideBarTheme}>
        <Box
          height={height}
          paddingLeft={2}
          paddingRight={1}
          color="#FFFFFF"
          bgcolor="#0099CC"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="bold"
        >
          {children}
        </Box>
      </ThemeProvider>
    );
  };

  export default TopBarLayout;