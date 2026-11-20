import React from 'react';
import { useLocalStorage } from 'react-use';
import logo from './logo.svg';
import './App.css';
import TopBarLayout from './components/topBar';
import { Button, ThemeProvider, Typography, TextField, makeStyles } from '@material-ui/core';
import {Box} from '@material-ui/core';
import PokeCanvas from './components/pokeCanvas';
import Canvas from './components/canvas';
import { defaultTheme } from 'themes';
import Pokedex from 'components/pokedex';
import PokeShop from 'components/pokeshop';


import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import UserSelect from 'components/userselection';
import UserInfo from 'components/userinfo';
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


function App() {
  const [username,setUsername] = React.useState();

  if (!username) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography>Create a player to start.</Typography>
        <UserSelect changeUser={setUsername} />
      </Box>
    );
  }

  return <PlayerApp username={username} setUsername={setUsername} />;
}

function PlayerApp({username, setUsername}) {
  const classes = useStyles();

  const [appState,setAppState] = React.useState('play');
  const [tableconfig, setTableconfig] = useLocalStorage(`configuration-${username}`, Array(10).fill(true));
  const [operation, setOperation] = useLocalStorage(`configuration-operation-${username}`, 'both');
  console.log(`username when starting app: ${username}`)

  return (
      [<ThemeProvider key='top-bar-theme' theme={defaultTheme}>
      <Box
          display="flex"
          height="100%"
          flexDirection={'column'}
          // overflow="auto"
        >
          <TopBarLayout height={40}>
            <div className={classes.root}>
              <Button key='play-button' variant='contained' onClick={() => setAppState('play')}>
                <Typography>
                  Go!
                </Typography>
              </Button>
              <Button key='pokedex-button' variant='contained' onClick={() => setAppState('pokedex')}>
                <Typography>
                  Pokedex
                </Typography>
              </Button>
              <Button key='shop-button' variant='contained' onClick={() => setAppState('shop')}>
                <Typography>
                  Shop
                </Typography>
              </Button>
            </div>
            <Box alignItems="center">
              <UserInfo username={username} tableconfig={tableconfig} setTableconfig={setTableconfig} operation={operation} setOperation={setOperation}/>
              <UserSelect changeUser={(username) => {
                setUsername(username)
                console.log(`username set to ${username}`)
              }}/>
            </Box>
            </TopBarLayout>
        </Box>
    </ThemeProvider>,
    <div key='app' className="App">
        <Box
          display="flex"
          height="100vh"
          justifyContent="center"
          alignItems="center"
          flexDirection={'column'}
        >
          <Box
            display="flex"
            width="33%"
            flexDirection={'column'}
          >
            <div key='buttons' style={{ width: '100%' }}>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }} margin={2}>
                <Button key='play-button' variant='contained' onClick={() => setAppState('play')} disabled={appState === 'play'}>
                  <Typography>
                    Go!
                  </Typography>
                </Button>
                <Button key='pokedex-button' variant='contained' onClick={() => setAppState('pokedex')} disabled={appState === 'pokedex'}>
                  <Typography>
                    Pokedex!
                  </Typography>
                </Button>
              </Box> */}
            </div>
            {appState === 'play' ? 
              <PokeCanvas id='mycanvas' username={username} tableconfig={tableconfig} operation={operation}/> :
              (appState === 'pokedex' ? <Pokedex key='pokedex' username={username}/> :
                 (appState === 'shop' ? <PokeShop key='shop' username={username}/> : <TextField>Press Go! or Pokedex</TextField> ))
            }
          </Box>
        </Box>
    </div>]
  );
}

export default App;
