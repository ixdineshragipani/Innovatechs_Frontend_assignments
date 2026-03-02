import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav >
      <div>DocManager</div>
      <div>
        <NavLink to="/master" className={({ isActive }) => isActive ? 'active' : ''}>
          Master Config
        </NavLink>
        <NavLink to="/user" className={({ isActive }) => isActive ? 'active' : ''}>
          User Portal
        </NavLink>
        {/* <NavLink to="/submissions" className={({ isActive }) => isActive ? 'active' : ''}>
          Submissions
        </NavLink> */}
      </div>
    </nav>
  );
}