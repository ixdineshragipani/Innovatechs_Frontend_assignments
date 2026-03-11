import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {User,LogIn,Shield,Lock} from "lucide-react"
import dubaiSkyline from "../assets/dubai-skyline.jpg";
import dubaiEmblem from "../assets/dubai-emblem.png";

const LandingPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (!userName || !password) {
      setError("Please enter valid username and password");
      return;
    }
    if (userName !== "admin" && !userName.includes("@gmail.com")) {
      setError("Please enter valid username");
      return;
    }
    if (password.length < 8 && password !== "admin") {
      setError("Please enter valid password");
      return;
    }
    if (userName === "admin" && password === "admin") {
      navigate("master");
    } else {
      navigate("config");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="flex min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${dubaiSkyline})` }}
      />
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#152240]/55 via-[#152240]/50 to-[#152240]/55" />

      {/* Decorative gold lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />

      {/* Login Card */}
      <div className="relative justify-center z-10 w-full max-w-md mx-4" onKeyDown={handleKeyDown}>
        <div className="backdrop-blur-2xl bg-card border border-[#FFBF00]/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={dubaiEmblem}
                alt="Government of Dubai Emblem"
                className="w-20 h-20 object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-[#FFBF00] mb-1">
              Government of Dubai
            </h1>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent mx-auto mt-3" />
            <p className="text-[#FFBF00] text-sm mt-3 tracking-widest uppercase">
              Secure Portal Access
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col justify-center px-[50px] pb-10 space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[#FFBF00] text-m font-medium flex items-center gap-2">
                <User className="w-3 h-3" />
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder=" Enter your username"
                  className="pl-2 bg-[#192841]/10 w-full border border-[#FFBF00] text-[#FFBF00] placeholder:text-[#FFBF00]/30 focus:border-[#FFBF00] focus:ring-[#FFBF00] h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[#FFBF00] text-s font-medium flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" Enter your password"
                  className="pl-2 bg-[#192841]/30 border w-full border-[#FFBF00] text-[#FFBF00] placeholder:text-[#FFBF00]/30 focus:[#FFBF00]/50 focus:ring-[#FFBF00]/20 h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={login}
              className="w-full h-10 bg-gradient-to-r from-[#FFBF00] to-yellow-300 text-black font-semibold text-base rounded-xl hover:from-yellow-300 hover:to-[#FFBF00] transition-all duration-300 shadow-lg shadow-[#FFBF00]/20 hover:shadow-[#FFBF00]/40"
            >
              Login
            </button>

            <p className="text-center text-[#FFBF00] text-xs mt-6">
              © {new Date().getFullYear()} Government of Dubai. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


// import React from 'react'
// import { useState,useEffect } from 'react'
// import { Link,useNavigate } from 'react-router-dom'
// import master from './Master'
// import config from './Config'


// export default function LandingPage() {
//     const [userName,setUserName]=useState("");
//     const [password , setPassword]=useState("");
//     const [error,setError]=useState("");

//     const navigate=useNavigate();
//     const login=()=>{
//         if(!userName||!password){
//             setError("Please enter valid username and password");
//             return;
//         }
//         if(userName!=="admin" && !userName.includes("@")){
//             setError("Please enter valid username")
//             return;
//         }
//         if(password.length<8 && password!=="admin"){
//             setError("Please enter valid password");
//             return;
//         }
//         if(userName==="admin" && password==="admin"){
//             navigate("master");
//         }else{
//             navigate("config");
//         }
//   };
// const handleKeyDown = (e) => {
//     if (e.key === "Enter"){login()};
// }
//   return (
//     <div className='grid grid-cols-2 bg-gradient-to-br from-red-200 to-blue-200'>
//         <div className='grid col-span-1 h-screen'>
//             <img className="h-[500px] rounded-[100px]" src="../public/burj_al_arab.webp" alt="logo"/>
//         </div>
//         <div className='grid col-span-1 border-black rounded-r'>
//             <div className='flex flex-col justify-center items-center h-screen'>
//                 <h1 className='text-4xl pb-[20px]'>Government of Dubai</h1>
//                 <div className='p-[5px]'>
//                     <p className='p-[5px]'>Username: </p>
//                     <input type='text' placeholder=' Username' onChange={(e)=>setUserName(e.target.value)} className='rounded'/>
//                 </div>
//                 <div >
//                     <p className='p-[5px]'>Password: </p>
//                     <input type='password' placeholder=' Password' onChange={(e)=>{setPassword(e.target.value)}} className='rounded'/>
//                 </div>
//                 {<p className='text-red-500'>{error}</p>}
//                 <button className="mt-[10px] p-1 bg-blue-500 hover:bg-blue-700 font-bold rounded" onClick={login}>Login</button>
//             </div>
//         </div>
//     </div>
//   )
// }
