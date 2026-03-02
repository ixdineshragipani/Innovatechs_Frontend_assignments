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
    <div>
        <div className='flex-cols'>
            <div>
                <p>Username: </p>
                <input type='text' placeholder='username' onChange={(e)=>setUserName(e.target.value)}/>
            </div>
            <div>
                <p>Password</p>
                <input type='password' placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 font-bold rounded" onClick={login}>Login</button>
        </div>
    </div>
  )
}
