import { Route,Routes } from "react-router-dom";
import Master from "../components/Master";
import Config from "../components/Config";
import LandingPage from "../components/LandingPage";
import Configuration from "../components/Configuration";

const AppRoutes=()=>{

    return(
        <Routes>

            <Route path="/" element={<LandingPage/>}/>
            <Route path="/Config" element={<Config/>}/>
            <Route path="/Master" element={<Master/>}/>
            <Route path="/Configuration" element={<Configuration/>}/>

        </Routes>
    )
}
export default AppRoutes;