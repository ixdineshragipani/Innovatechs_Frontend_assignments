import React from "react";
import { Route } from "react-router-dom";
import Header from "./Header.jsx";



const UserDashboard=()=>{
    return (
        <div>
                <Header />
            <div className=" grid grid-cols-20 pt-2">
                <div className="grid col-span-1 p-4 mr-3 border-r justify-center border-black-600">
                    <img src="./public/dashboard_icon.png"/>
                    <img src="./public/property_list.png"/>
                    <img src="./public/platform_icon.png"/>
                    <img src="./public/leads_dashboard.png"/>
                    <img src="./public/deals_dashboard.png"/>
                    <img src="./public/user_management.png"/>
                    <img src="./public/watermark.png"/>
                </div>
                <div className="grid h-screen p-5 col-span-19">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard;