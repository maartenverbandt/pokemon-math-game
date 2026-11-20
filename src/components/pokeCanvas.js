import React, { useEffect } from 'react';
import {useLocalStorage} from 'react-use';

import { Box, Button, IconButton, TextField, Grid, Card, CardContent, CardActions, Typography,Dialog,DialogActions,DialogContent } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { PokeContent } from './pokedex';


import Canvas from './canvas';

const generateQuestion = (tables, operation) => {
  // username = 'arthur'
  // if (username === 'arthur' || username === 'maffeaap') {
  if (operation === 'multiplication' || (operation === 'both' && Math.random() >= 0.5)) { // X multiply
    const value1 = Math.floor(Math.random() * 11);
    const value2 = tables[Math.floor(Math.random() * tables.length)];

    return ({
      text: `${value1} x ${value2} = `,
      result: value1 * value2 
    })
  } else { // : division
    const value1 = Math.floor(Math.random() * 11);
    const value2 = tables[Math.floor(Math.random() * tables.length)];

    return ({
      text: `${value1*value2} : ${value2} = `,
      result: value1
    })
  }
  // } else {
    // const value1 = Math.floor(Math.random() * 31);
    // const value2 = Math.floor(Math.random() * (31 - value1));
    
    // if (Math.random() >= 0.5) {
    //   return ({
    //     text: `${value1} + ${value2} = `,
    //     result: value1 + value2 
    //   })  
    // } else {
    //   const maxval = Math.max(value1, value2);
    //   const minval = Math.min(value1, value2);

    //   return ({
    //     text: `${maxval} - ${minval} = `,
    //     result: maxval - minval 
    //   })
    // }
    // const mytables = [2,5,10]
    // const value1 = Math.floor(Math.random() * 11);
    // const value2 = mytables[Math.floor(Math.random() * mytables.length)];

    // return ({
    //   text: `${value1} x ${value2} = `,
    //   result: value1 * value2 
    // })
}


const QuestionForm = ({tables, operation, onRight}) => {

  const [answer,setAnswer] = React.useState('');
  const [question,setQuestion] = React.useState(generateQuestion(tables, operation));
  const [start,setStart] = React.useState(performance.now())
  
  const verify = () => {
    if (Number(answer) === question.result) {
      onRight(performance.now() - start);
      setQuestion(generateQuestion(tables, operation));
      setStart(performance.now())
      setAnswer('');
    }
  }

  useEffect(() => {
    setQuestion(generateQuestion(tables, operation));
    setStart(performance.now())
    setAnswer('');
  }, [tables, operation])

    // <Grid container xs="12" spacing="1">
    //   <Grid item xs={12} sm={11}>
  return (
    <Box
      bgcolor='white'
      display='inline-flex'
    >
      <TextField 
        id='answer'
        label={question.text}
        fullwidth='true' 
        value={answer}
        variant='filled'
        onChange={(e) => {
          setAnswer(e.target.value)}}
        onKeyDown={(ev) => {
          console.log(`Pressed keyCode ${ev.key}`);
          if (ev.key === 'Enter') {
            ev.preventDefault();
            verify()
          }
        }}
      />
      <IconButton 
        id='ok' 
        onClick={verify}
        color='primary'
        variant='filled'
        size='large'
      >
        <CheckBoxIcon size='large'/>
      </IconButton>
      </Box>
  )
}

const getPokeUrl = (pokeindex) => {
  return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${('00' + pokeindex).slice(-3)}.png`
}


function lastPokemonHelper (pokemon) {
  if (pokemon.length === 0) {
    return 
  }
}

const PokeCanvas = ({username, tableconfig, operation}) => {
  const [pokemon, setPokemon] = useLocalStorage(`pokemon-${username}`, []);
  const [money, setMoney] = useLocalStorage(`pokemoney-${username}`, 0);
  const tables = React.useMemo(() => tableconfig.reduce((out,x,idx) => x ? out.concat(idx+1) : out, []), [tableconfig]);
  const [appState,setAppState] = React.useState('run');
  const [covered,setCovered] = React.useState([0,1,2,3,4,5,6,7,8]);

  // const catchList = [];
  // const freeList = [ ...Array(350).keys() ].filter(x => !catchList.includes(x+1));
  const freeList = [ ...Array(500).keys() ]
  const [pokeindex,setPokeindex] = React.useState(freeList[Math.floor(Math.random()*freeList.length)]+1); //freeList is 0-based
  const [score,setScore] = React.useState(0.0)

  const startNextRound = () => {
    setPokeindex(freeList[Math.floor(Math.random()*freeList.length)]+1);
    setScore(0.0);
    setCovered([0,1,2,3,4,5,6,7,8]);
    setAppState('run');
  };

  // useEffect(() => {
  // if( username in mymoney) {
  //   setMoney(mymoney[username]);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }},[username])

  useEffect(() => {
    if(covered.length === 0) {
      const newCatch = {index: pokeindex, power: Math.round(score * (1 + Math.random()*0.2))};
      setPokemon(pokemon.concat([newCatch]));
      setMoney(Number(money) + 10);
      console.log(money);
      setAppState('pokedex');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[covered])

  return (
    <>
    <Card>
    <div>
      <Canvas key='image_canvas' path={getPokeUrl(pokeindex)} covered={covered} width={600} height={360}/> 
    </div>
    {appState === 'run' ?
      <div>
        <QuestionForm key='answer' tables={tables} operation={operation} onRight={(elapsed) => {
          
          const points = (tables.length*2)*100*Math.min(1.0, 0.5 ** (elapsed/5000 - 1.0))/9.0;
          setScore((x) => x + points)
          
          setCovered((x) => {
            const idx = Math.floor(Math.random() * x.length);
            return [...x.slice(0,idx), ...x.slice(idx+1)];
          })

          console.log(`points: ${points}, score: ${score}, covered: ${covered}`)
        }}/>
        </div> : <></>}
    </Card>
    <Dialog
      // fullScreen={fullScreen}
      open={appState === 'pokedex'}
      onClose={startNextRound}
      aria-label="Caught Pokemon"
    >
      {pokemon.length > 0 ? 
      (<DialogContent>
        <PokeContent pokeindex={pokemon[pokemon.length-1].index} power={pokemon[pokemon.length-1].power}/>
      </DialogContent>) : <></>}
      <DialogActions>
        <Button onClick={startNextRound}>
          Next
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default PokeCanvas;
