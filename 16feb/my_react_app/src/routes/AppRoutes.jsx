import {Routes, Route} from 'react-router-dom';
import Login from '../Pages/Login.jsx';
import ForgetPassword from '../Pages/ForgetPassword.jsx';
const AppRoutes=()=>{
    return (
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/ForgetPassword' element={<ForgetPassword/>}/>
        </Routes>
    )
}

export default AppRoutes;