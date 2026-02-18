import React from "react";
import { useNavigate, Route } from 'react-router-dom';

const handleTimer=()=>{
    console.log("Timer function called");
    setTimeout(() => {
        console.log("Timer function executed after 45 seconds");
    })
}

const handleSendOTP=()=>{
    console.log("Send OTP button clicked");

}

const ForgetPassword=()=>{
    return (
        <div className="grid grid-cols-2 p-2 gap-[20px]">
        <div className="grid bg-gradient-to-br from-[#EFEBFD] from-10% to-[#FCE9CE80] h-screen rounded-[24px] pr-5 pl-5 justify-center items-center col-span-1">
            <img src="./public/house.png"/>
        </div>
        <div className="grid col-span-1 gap-[30px] w-[800px]">
            <div className=" w-full bg-[#F7F9FD]  rounded-[10px]">
            </div>
            <div className="bg-[#F7F9FD] rounded-[20px] h-[658px] w-full relative ">
                <img src="./public/activ.png" className="justify-center pt-[32px] items-center mx-auto h-[80px] w-[48px]"/>
                <div className=" p-5" >
                    <div>
                        <h1 className="font-bold text-xl p-3">Forgot Password</h1>
                        <div className="p-3">Email Address<span className="font-bold dark:text-red-500">*</span></div>
                        <input type="text" placeholder="Enter Email Address" className="p-3 bg-white w-full rounded-lg "/>
                    </div>
                    <div id="otp-section" className="pt-3"> 
                        <div>Enter OTP<span className="text-bold dark:text-red-500">*</span></div>
                        <div className="otp-wrapper">
                            {
                                otp.map((digit, index)=>{
                                    <input 
                                    type="text" 
                                    key={index} 
                                    maxLength="4" 
                                    className="otp-input p-3 bg-white w-[50px] rounded-lg text-center"
                                    inputMode="numeric"
                                    onChange={(e)=>{
                                        handleChange(e.target.value, index)}
                                    }
                                    
                                    />
                                })
                            }
                        </div>
                    </div>
                    <div className="pt-10"><button onClick={handleSendOTP} className="bg-[#6B40ED] text-white p-4 w-full rounded-full">Send OTP</button></div>
                    <div className="flex justify-center p-3">
                        Didn't revieve otp? <a href="#" className="text-bold underline">Send again otp in  {handleTimer} sec</a>
                    </div>
                    </div>
            </div>
        </div>
    </div>
    )
}

export default ForgetPassword;