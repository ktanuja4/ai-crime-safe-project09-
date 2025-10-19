import React from 'react'
import backgroundVideo from '../images/vedio1.mp4'; 


const Main_home = () => {
  return (
    // The id="home" is important for the header's scroll links to work correctly.
    <div id="home" className='main_home' style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
        <video 
          autoPlay 
          loop 
          muted 
          style={{
            
            position: 'absolute',
            width: '100%',
            left: '50%',
            top: '50%',
            height: '100%',
            objectFit: 'cover' ,
            transform: 'translate(-50%, -50%)',
            zIndex: '-1'
          }}
        >
          <source src={backgroundVideo}  />
          Your browser does not support the video tag.
        </video>
    </div>
  )
}

export default Main_home
