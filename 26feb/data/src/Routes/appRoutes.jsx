import React from "react";
import { Route,Routes,Navigate } from "react-router-dom";
import Master from "../components/Master";
import Config from "../components/Config";
import LandingPage from "../components/LandingPage";

const AppRoutes=()=>{

    return(
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/Config" element={<Config/>}/>
            <Route path="/Master" element={<Master/>}/>
        </Routes>
    )
}
export default AppRoutes;