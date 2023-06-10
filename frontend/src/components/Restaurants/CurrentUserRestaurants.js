import * as restaurantActions from "../../store/restaurants";

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OpenMenu from '../Navigation/OpenMenu';
import DeleteRestaurant from './DeleteRestaurant'
import './Restaurants.css';

function CurrentUserRestaurants() {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    // eslint-disable-next-line
    const [showMenu, setShowMenu] = useState(false);
    let restaurants = useSelector((state) => state.restaurants)
    let user = useSelector((state)=> state.session)
    restaurants = Object.values(restaurants)

    restaurants = restaurants.filter(restaurant=> restaurant.owner_id === user.user.id)

    useEffect(() => {
    closeMenu();
    dispatch(restaurantActions.getUserRestaurants(user)).then(()=> setIsLoaded(true))
    }, [dispatch, user])

    const closeMenu = () => setShowMenu(false);

    return (
        <>
                  <div id="spots-flex">
        {isLoaded && 
        restaurants.map((restaurant) => 
        (<div key={restaurant.id}>
                <div className="allspots">
            <NavLink to={`/restaurants/${restaurant.id}`}>
            <img src={restaurant.logo} onError={({ currentTarget }) => {
    currentTarget.onerror = null; // prevents looping
    currentTarget.src='https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
  }}/>
            <div className="city"> <p className="location">{restaurant.city}, {restaurant.state}</p><p className="ratingsbox"><i className="fa fa-star" aria-hidden="true"></i>{!restaurant.rating ? "No Stars" : Math.round(`${restaurant.rating}` / .10) * .10}</p></div>
            </NavLink>
            <div className="buttons">
                <div className="updatebutton">
            <button>
                <NavLink to={`/restaurants/${restaurant.id}/edit`}>UPDATE</NavLink>
                </button>
                </div>
                <div className="deletebutton">
            <OpenMenu
                itemText="DELETE"
                onItemClick={closeMenu}
                modalComponent={<DeleteRestaurant prop={restaurant}/>}
                /> </div>
                </div>
                </div>
            </div>))}
            </div>
        </>
    )
}

export default CurrentUserRestaurants