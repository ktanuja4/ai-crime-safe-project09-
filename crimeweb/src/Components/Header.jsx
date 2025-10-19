// import React, { useState } from 'react';
// import crimewebLogo from "../images/crimeweb-logo-white.png"
// import "../Styles/header.css"
// import headerback from "../images/image2.png"
// import { NavLink } from 'react-router-dom';
// import { Link as ScrollLink } from 'react-scroll';
// import { FaBars, FaTimes } from 'react-icons/fa';

// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleMenuToggle = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <>
//       <div className='Header' style={{ backgroundImage: `url(${headerback})` }}>
//         <div className="fixed-header-section">
//           <div className='header-container'>
//             <div className='logo'>
//               <NavLink to="/">
//                 <img src={crimewebLogo} alt='Crimeweb Logo' />
//               </NavLink>
//             </div>
//             <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
//               <ul>
//                 <li><NavLink to='/' onClick={() => setMenuOpen(false)}>Home</NavLink></li>
//                 <li><NavLink to='/report' onClick={() => setMenuOpen(false)}>Report</NavLink></li>
//                 <li><NavLink to='/detect' onClick={() => setMenuOpen(false)}>Detect</NavLink></li>
//                 <li><ScrollLink to='contact' smooth={true} duration={500} onClick={() => setMenuOpen(false)}>Contact</ScrollLink></li>
//               </ul>
//             </nav>
//             <div className="menu-toggle" onClick={handleMenuToggle}>
//               {menuOpen ? <FaTimes /> : <FaBars />}
//             </div>
//           </div>
//         </div>
//         {/* <div className='hero-content'>
//           <p>AI POWERED CRIME ANALYSIS AND SAFETY PLATFORM</p>
//         </div> */}
//       </div>
//     </>
//   )
// }

// export default Header








import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import '../Styles/header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          {/* Using a ScrollLink here to ensure clicking the logo also scrolls to top */}
          <ScrollLink
            to="home" //  'home' is the top section ID
            smooth={true}
            duration={500}
            className="logo-text"
            style={{ cursor: 'pointer' }}
            onClick={closeMenu}
          >
            AI CrimeSafe
          </ScrollLink>
        </div>

        <nav className={`nav ${menuOpen ? 'active' : ''}`} onClick={closeMenu}>
          <ScrollLink activeClass="active" to="home" spy={true} smooth={true} offset={-70} duration={500} className="nav-item">Home</ScrollLink>
          <ScrollLink activeClass="active" to="report" spy={true} smooth={true} offset={-70} duration={500} className="nav-item">Report</ScrollLink>
          <ScrollLink activeClass="active" to="detect" spy={true} smooth={true} offset={-70} duration={500} className="nav-item">Detect</ScrollLink>
          <ScrollLink activeClass="active" to="contact" spy={true} smooth={true} offset={-70} duration={500} className="nav-item">Contact Us</ScrollLink>
        </nav>

        <div className="menu-icon" onClick={handleMenuToggle}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
