import React from 'react'
import "./Register.css"

export default function Register({handler}) {
 
  return (
   <div className="render">
     <h1>REGISTER</h1>

     <div id="container">
        <div className="lbl">name <input type="text" /></div>
        <div className="lbl">emai <input type="text" /></div>
        <div className="lbl">password <input type="text" /></div>
        <div className="lbl">phone <input type="text" /></div>
        <div className="wrapper">
          <input type="button" value="submit" className="btn" onClick={handler}/>
        <input type="button" value="cancel" className="btn" />

      </div>


     </div>

   </div>
  )
}

