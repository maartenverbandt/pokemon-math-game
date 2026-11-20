import { FormControl, Box, Typography } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import {useLocalStorage} from 'react-use';
import ConfigurationPopup from './configuration';

const UserInfo = ({username, tableconfig, setTableconfig, operation, setOperation}) => {
    const [money] = useLocalStorage(`pokemoney-${username}`, 0);
    
    // useEffect( ,[])

    return (
      <FormControl
        variant={'filled'}
        fullWidth={false}
        >
        <Box>
            <Typography>
                {money}
            </Typography>
            <ConfigurationPopup config={tableconfig} setConfig={setTableconfig} operation={operation} setOperation={setOperation} />
        </Box>
        
        </FormControl>
    )
  }

  export default UserInfo;