import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div className='navbar'>
       <nav className='links'>
         <div><Link>home</Link></div>
        <div><Link>about</Link></div>
        <div><Link>contact</Link></div>
        <div><Link>market</Link></div>
        <div><Link>blog</Link></div>
       </nav>
       <nav className="icons">
        <div>btns</div>
        <div>btns</div>
        <div>btns</div>
       </nav>
    </div>
  )
}

export default NavBar