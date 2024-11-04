'use client'
import Image from "next/image";
import { redirect } from 'next/navigation'
import { useEffect, useState } from "react";
 
export default function Home() {
  useEffect(() => { 
    setTimeout(() => {  
      redirect('/signin')  
    }, 1500)  
  }, [])
  return (
    <div>
      <h1 className="text-primary mt-5 text-center">Welcome to NEXT POS 2024!</h1>
    </div>
  );
}
