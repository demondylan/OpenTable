import * as sessionActions from '../../store/session';

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import OpenMenu from './OpenMenu';
import LoginForm from '../Login/LoginForm';
import SignupForm from '../Signup/SignupForm';
import { useHistory } from 'react-router-dom';
import './Navigation.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const handleSubmit = (e) =>{
    dispatch(sessionActions.demoLogin())
  }

  return (
    
      <div className="dropDown">
      <button onClick={openMenu}>
      <div className="bars">
      <i className="fa fa-bars"></i>
        <i className="fas fa-user-circle" />
        </div>
      </button>
      <ul className={ulClassName} ref={ulRef}>
      {user ? (
        <div className='welcome'>
        <li>Hello, {user.username}</li>
        <li>{user.email}</li>
        <li>
          <div className='managespots'>
             <button> <NavLink to="/restaurants/current" onClick={closeMenu}>Manage your restaurants</NavLink>
             </button>
             </div>
             </li>
        <li>
          <div className='logoutbutton'>
          <button onClick={logout}>Log Out</button>
          </div>
        </li>
        </div>
       ) : (
        <div className='dropdownButtons'>
                      <OpenMenu
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginForm />}
            />
            <OpenMenu
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupForm />}
            />
            <li>
              <button type='submit' onClick={handleSubmit}>Demo User Login</button>
            </li>
        </div>
          )}
      </ul>
      </div>
    
  );
}

export default ProfileButton;