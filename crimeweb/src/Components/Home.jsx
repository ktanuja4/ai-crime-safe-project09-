import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/home.css';
import halfimage from '../images/home1image.png';
import headerback from "../images/image2.png"


const Home = () => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    navigate('/learn-more');
  }
  return (
    <>
    <div id="home" className="Home-background"style={{ backgroundImage: `url(${headerback})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', width: '100%' }}>
    
      <div className="section4">
        <p>OUR SYSTEM HELPS IN DETECTING,REPORTING,AND ANALYZING CRIME USING AI/ML</p> 
         <button onClick={handleClick}> To Learn more Click here</button>
        </div>
      <div className="section5">

         <img src={halfimage} alt="CrimeWeb Logo" className="Home-logo" />
      </div>
    </div>
    </>
  );
}

export default Home;