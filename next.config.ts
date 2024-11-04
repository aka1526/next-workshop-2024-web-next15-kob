import type { NextConfig } from "next";
const buildId = new Date().getTime().toString();
require('dotenv').config();

const nextConfig: NextConfig = {
  /* config options here */

  //output: "export",
  /* ถ้าใช้ file .ts ให้เปลี่ยนเป็น  standalone*/
   /*standalone  export*/

  //basePath: "/web", //กรณี subfloder
  devIndicators :{
    buildActivity:false,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: false,
  env: {
    // PORT: '8080',
    // HOSTNAME :"0.0.0.0",
    API_SERVER_URL: process.env.API_SERVER_URL,
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
  
};

 

export default nextConfig;
