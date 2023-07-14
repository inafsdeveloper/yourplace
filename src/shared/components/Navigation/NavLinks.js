import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  let history = useHistory();
  const logoutHandler = () => {
    auth.logout();
    history.push("/auth");
  }
  return <ul className="nav-links">
    <li>
      <NavLink to="/" exact>ALL USERS</NavLink>
    </li>
    {auth.isLoggedIn && <li>
      <NavLink to={`/${auth.userid}/places`}>MY PLACES</NavLink>
    </li>}
    {auth.isLoggedIn && <li>
      <NavLink to="/places/new">ADD PLACE</NavLink>
    </li>}
    {!auth.isLoggedIn && <li>
      <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li>}
    {auth.isLoggedIn && (
      <li>
        <button onClick={logoutHandler} >LOGOUT</button>
      </li>
    )}
  </ul>
};

export default NavLinks;