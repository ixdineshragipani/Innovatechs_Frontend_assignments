import React from 'react'
import { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import master from './Master'
import config from './Config'
import navbar from './Navbar'



export default function LandingPage() {
    const [userName,setUserName]=useState("");
    const [password , setPassword]=useState("");
    const [error,setError]=useState("");

    const navigate=useNavigate();
    const login=()=>{
        if(!userName||!password){
            setError("Please enter valid username and password");
            return;
        }
        if(userName!=="admin" && !userName.includes("@")){
            setError("Please enter valid username")
            return;
        }
        if(password.length<8 && password!=="admin"){
            setError("Please enter valid password");
            return;
        }
        if(userName==="admin" && password==="admin"){
            navigate("master");
        }else{
            navigate("config");
        }
  };
const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
}
  return (
    <div className='grid grid-cols-2'>
        <div className='grid col-span-1 h-screen items-center'>
            <img className="h-screen" src="../public/burj_al_arab.webp" alt="logo"/>
        </div>
        <div className='grid col-span-1 bg-gradient-to-br from-red-200 to-blue-200 border-black'>
            <div className='flex flex-col justify-center items-center h-screen'>
                <div className='p-[5px]'>
                    <p className='p-[5px]'>Username: </p>
                    <input type='text' placeholder=' Username' onChange={(e)=>setUserName(e.target.value)} className='rounded'/>
                </div>
                <div >
                    <p className='p-[5px]'>Password: </p>
                    <input type='password' placeholder=' Password' onChange={(e)=>{setPassword(e.target.value)}} className='rounded'/>
                </div>
                {<p className='text-red-500'>{error}</p>}
                <button className="mt-[10px] p-1 bg-blue-500 hover:bg-blue-700 font-bold rounded" onClick={login}>Login</button>
            </div>
        </div>
    </div>
  )
}
