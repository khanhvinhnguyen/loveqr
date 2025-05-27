import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NavBar = () => {
  return (
    <header className='container content-center mx-auto h-20'>
      <div className="flex justify-between items-center">
        <Link href="/" className='flex items-center'>
          <Image
            src="/loveqr-logo.png"
            className="w-10 h-10"
            alt="Logo"
            width={100}
            height={100}
            unoptimized
          />
          <h1 className="text-2xl font-bold">LoveQR</h1>
        </Link>
      </div>
    </header>
  )
}

export default NavBar;