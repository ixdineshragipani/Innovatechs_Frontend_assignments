import React from "react";
import { Route } from "react-router-dom";

const Header=()=>{
    return(
        <div className="flex w-max gap-[1350px]  border-b border-gray-600 pt-4 z-10">
            <img src="./public/dashboard_activ.png" className="h-[50px] w-[50px]"/>
            <div className="flex">
                <img src="./public/bell.png" className="h-[40px] w-[40px] p-2 rounded-lg bg-[#F4F5FB]"/>
                <img src="./public/profile.png" className="pl-3"/>
                <div>
                    <div className="font-bold">
                        Admin
                    </div>
                    <div className="text-xs text-[#566D80]">
                        admin@activeproperties.com
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Header;