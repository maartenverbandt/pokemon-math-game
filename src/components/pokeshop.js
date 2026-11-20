import React, { useEffect, useState } from 'react';
import {useLocalStorage} from 'react-use';
import Carousel from 'react-multi-carousel';

import { Box, Button, IconButton, TextField, Grid, Card, CardContent, CardActions, Typography,Dialog,DialogContent } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


import Canvas from './canvas';

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };


const getBerryUrl = (id) => {
  return `https://www.serebii.net/itemdex/sprites/sv/${id}.png`
}

export const ShopContent = ({item}) => {
  return (
    <Box bgcolor='white' display='inline-flex' flexDirection={'column'}>
      <Typography>{item.id}</Typography>
        <img src={item.url(item.id)}/>
      <Typography>{`Cost: ${item.cost}`}</Typography>
    </Box>
  )
}


const berries = [
  {
    id: 'tangaberry',
    url: getBerryUrl,
    cost: 20,
    callback: () => {

    } 
  },
  {
    id: 'spelonberry',
    url: getBerryUrl,
    cost: 100
  }]


// https://www.serebii.net/itemdex/sprites/sv/tangaberry.png
const PokeShop = ({username, index, style}) => {
    const [selectedPokemon,setSelectedPokemon] = useState(0);

    return (
      // <Grid container>
      //   <Grid item>
      //     <PokeContent pokeindex/>
      //   </Grid>
      // </Grid>
      <Card>
          <CardContent>
              <Carousel infinite={true} responsive={responsive} keyBoardControl={true} customTransition="all .5" containerClass="carousel-container">
                  {berries.sort((a,b) => a.cost - b.cost).map(x => <Button key={`pokemon-${x.index}-div`}><ShopContent key={`shopcontent-${x.index}`} item={x} /></Button>)}
              </Carousel>
          </CardContent>
      </Card>
    )
  };

  
  const PokeSelect = ({username, index}) => {

  }

  
  export default PokeShop;