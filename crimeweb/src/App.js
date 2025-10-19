import React from 'react';
import { Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "./Styles/App.css"
import Header from './Components/Header';
import Home from './Components/Home';
import Report from './Components/Report';
import Detect from './Components/Detect';
import Footer from './Components/Footer';
import Learn_more from './Components/Learn_more';
import Content from './Components/Home';
import Main_home from './Components/Main_home';

// const MainLayout = () => {
//   return (
//     <>
//       <Header />
//       <Outlet />
//       <Footer />
//     </>
//   );
// };

function App() {
  return (
    <div className="App">

       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        {/* Route for the main single-page layout */}
        <Route path="/" element={
          <>
            <Header/>
            <Main_home/> 
            <Home/> 
            <Report/> 
            <Detect/> 
            <Footer/>
          </>
        } />

        {/* Separate route for the Learn More page */}
        <Route path="/learn-more" element={<Learn_more />} />
      </Routes>
    </div>
  );
}

export default App;
