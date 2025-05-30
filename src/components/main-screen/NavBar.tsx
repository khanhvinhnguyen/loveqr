import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircleHeart } from 'lucide-react';


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

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger>
                <div className='flex border-2 rounded-lg p-2 bg-gray-700'>
                  <Image
                    src="/icons/buyMeACoffee.png"
                    className="w-6 h-6"
                    alt="BuyMeACoffee logo"
                    width={100}
                    height={100}
                    unoptimized
                  />
                  <span className="hidden md:block ml-2">Buy me a coffee</span>
                </div>
            </DialogTrigger>
            <DialogContent className='bg-pink-100'>
              <DialogHeader>
                <DialogTitle>
                  <p className='text-black uppercase font-bold justify-self-center'>
                    Cứu team khỏi đói!
                  </p>
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col justify-center items-center gap-4">
                    <p>Donate đi mà, không là team để logo LoveQR thành Love404 luôn đó!</p>
                    <Image
                      src="/momo.jpg"
                      alt="Momo info"
                      className='rounded-lg'
                      width={300}
                      height={300}
                      unoptimized
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Link href="https://forms.gle/uqzXQTB8rqnGrwod7" target="_blank" className='flex border-2 rounded-lg p-2  bg-gray-700'>
            <MessageCircleHeart />
            <span className="hidden md:block ml-2">Đóng góp ý kiến chung</span>
          </Link>

        </div>
      </div>
    </header>
  )
}

export default NavBar;