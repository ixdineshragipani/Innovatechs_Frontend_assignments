import React from "react";
import { Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import ForgetPassword from "./ForgetPassword.jsx"

function handleLogin(){
  console.log("Login button clicked");
}


const Login=()=>{
    return(
        <div className="grid grid-cols-2 p-5 w-full gap-[20px]">
            <div className="grid w-full bg-gradient-to-br from-[#EFEBFD] from-10% to-[#FCE9CE80] h-screen rounded-[24px] pr-5 pl-5 justify-center items-center col-span-1">
                <img src="./public/house.png"/>
        </div>
        <div className="grid col-span-1 gap-[30px] w-[800px]">
            <div className=" w-full bg-[#F7F9FD]  rounded-[10px]"></div>
            <div className="bg-[#F7F9FD] rounded-[20px] h-[658px] w-full relative ">
                <img src="./public/activ.png" className="justify-center pt-[32px] items-center mx-auto h-[80px] w-[48px]"/>
                <div className=" p-5" >
                    <div>
                        <h1 className="font-bold text-black text-3xl  p-3">Login</h1>
                        <div className="p-3 text-black">Email Address<span className="font-bold dark:text-red-500">*</span></div>
                        <input type="text" placeholder="Username" className="p-3 bg-white w-full rounded-lg "/>
                        <div className="p-3 text-black">Password<span className="font-bold dark:text-red-500">*</span></div>
                        <input type="password" placeholder="Password" className="p-3 w-full mx-auto bg-white rounded-lg"/>
                        <img src="./public/eye_icon.png" className="absolute right-[35px] top-[320px] h-[20px] w-[20px]"/>
                    </div>
                    <div className="flex pt-2 justify-end"><a href="ForgetPassword" className="text-[#6B40ED]">Forgot Password?</a></div>
                    <div className="pt-10"><button onClick={handleLogin} className="bg-[#6B40ED] p-4 text-white w-full rounded-full">Login</button></div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Login;