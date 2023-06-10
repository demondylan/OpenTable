import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();


  return (
  
<>
    {isLoaded && (
      <div id= "Header">
     <NavLink to ='/'><img className='Logo'
      src="https://cdn.otstatic.com/cfe/12/images/pride-2022-c55b46.svg"
      alt='Logo' /></NavLink>
      <div id='userCorner'>
      {sessionUser && location.pathname != "/restaurants/Create" && (
        <div className='createspotbutton'>
          <button><NavLink to="/restaurants/Create">Create a New Restaurant</NavLink></button></div>
        )}
      <div className='profileButton'>
        <ProfileButton user={sessionUser} />
        </div>
      </div>
      </div>
    )}


</>
  );
}

export default Navigation;