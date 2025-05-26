import Link from 'next/link';
import React from 'react';

const NavBar = () => {
  return (
    <header className='container content-center mx-auto h-20'>
      <div className="flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">LoveQR</h1>
        </Link>
      </div>
    </header>
  )
}

export default NavBar;