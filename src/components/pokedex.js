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


const getPokeUrl = (pokeindex) => {
  return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${('00' + pokeindex).slice(-3)}.png`
}

export const PokeContent = ({pokeindex, power}) => {
  

  const [pokeData, setPokeData] = useState([]);
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeindex}/`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setPokeData(data);
      });
  }, [pokeindex]);

  return (
    <Box bgcolor='white' display='inline-flex' flexDirection={'column'}>
      <Box><Typography>{pokeindex}</Typography><Typography >{pokeData.name}</Typography></Box>
        <img src={getPokeUrl(pokeindex)}/>
      <Typography>{`Power: ${power}`}</Typography>
    </Box>
  )
}

const Pokedex = ({username, index, style}) => {
    const [pokemon, _] = useLocalStorage(`pokemon-${username}`, []);

    return (
    // //   <Card>
    //     <Carousel
    //         swipeable={false}
    //         draggable={false}
    //         showDots={true}
    //         responsive={responsive}
    //         // ssr={true} // means to render carousel on server-side.
    //         infinite={true}
    //         autoPlay={false}
    //         // autoPlaySpeed={1000}
    //         keyBoardControl={true}
    //         customTransition="all .5"
    //         transitionDuration={500}
    //         containerClass="carousel-container"
    //         removeArrowOnDeviceType={["tablet", "mobile"]}
    //         deviceType={this.props.deviceType}
    //         dotListClass="custom-dot-list-style"
    //         itemClass="carousel-item-padding-40-px"
    //     >
    //         {pokemon.map(x => <div key={`pokemon-${x.index}-div`}><PokeContent key={`pokemon-${x.index}`} pokeindex={x.index} power={x.power} /></div>)}
    //     </Carousel>
    // //    {/* {pokemon.map(x => <PokeContent key={`pokemon-${x.index}`} pokeindex={x.index} power={x.power} />)} */}
    // //   </Card>
        (<Card>
            <CardContent>
                <Carousel infinite={true} responsive={responsive} keyBoardControl={true} customTransition="all .5" containerClass="carousel-container">
                    {pokemon.sort((a,b) => a.index - b.index).map(x => <div key={`pokemon-${x.index}-div`}><PokeContent key={`pokemon-${x.index}`} pokeindex={x.index} power={x.power} /></div>)}
                </Carousel>
                {/* <Box display="flex" height="100vh">
                  <Grid container spacing={2}>
                    {pokemon.sort((a,b) => a.index - b.index)
                      .map(x => <Grid item key={`pokemon-${x.index}-div`}><PokeContent key={`pokemon-${x.index}`} pokeindex={x.index} power={x.power} /></Grid>)}
                  </Grid>
                </Box> */}
            </CardContent>
        </Card>)
        // (//<Box display="flex" height="100vh">
        //   <Grid container spacing={2} sx={{ overflowY: "scroll", maxHeight: "250px" }}>
        //     {pokemon.sort((a,b) => a.index - b.index)
        //       .map(x => <Grid item key={`pokemon-${x.index}-div`}><PokeContent key={`pokemon-${x.index}`} pokeindex={x.index} power={x.power} /></Grid>)}
        //   </Grid>)
        // //</Box>)
    )
  };
  
  export default Pokedex;