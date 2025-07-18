import React from 'react';
import Register from './components/register.jsx'; // ✅ fixed
import LandingPage from './components/landingPage.jsx'; // ✅ fixed
import { useState } from 'react'



export default function App() {
   const [show, setshow] = useState(true)
  function handleClick(){
    alert("clicked camble")
    setshow(false)
    console.log(show)
  }
  return (
    <div>
      <Register  handler={handleClick}/>
      { show === false ? <LandingPage /> : null } 
    </div>
  );
}
