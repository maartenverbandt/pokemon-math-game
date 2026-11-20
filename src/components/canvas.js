import React, { useRef, useEffect } from 'react'

// import bulbasaur from './0001 Bulbasaur.png'

const N = 3;

const Canvas = ({id,path,width,height,covered}) => {
  
  const canvasRef = useRef(null)
  

  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const img = new Image();

    img.addEventListener("load", () => {
        
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = canvas.width / 2 - width / 2;
        const y = canvas.height / 2 - height / 2;

        context.save(); // lock status
        context.clearRect(0,0,canvas.width,canvas.height)
        context.drawImage(img, x, y, width, height);
        
        // draw the covers
        const dii = canvas.width/N;
        const djj = canvas.height/N;
        covered.forEach(index => {
          const ii = Math.floor(index/3);
          const jj = Math.floor(index - 3*ii);
          
          context.fillStyle = '#000000'
          context.beginPath()
          context.rect(dii*ii,djj*jj,dii,djj)
          context.fill()
        })

        context.restore();
    });

    img.src = path;
    
      
  }, [covered, path])
  
  return <canvas ref={canvasRef} width={width} height={height}/>
    // return <img src={'0001 Bulbasaur.png'}/>
}

export default Canvas