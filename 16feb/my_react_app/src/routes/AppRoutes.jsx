import {Routes, Route} from 'react-router-dom';
import Login from '../Pages/Login.jsx';
import ForgetPassword from '../Pages/ForgetPassword.jsx';
import UserDashboard from '../Pages/UserDashboard.jsx';


const AppRoutes=()=>{
    return (
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
            <Route path='/UserDashboard' element={<UserDashboard/>}/>
        </Routes>
    )
}

export default AppRoutes;