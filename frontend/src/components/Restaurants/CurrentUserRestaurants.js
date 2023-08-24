import * as restaurantActions from "../../store/restaurants";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OpenMenu from '../Navigation/OpenMenu';
import DeleteRestaurant from './DeleteRestaurant'
import './Restaurants.css';

function CurrentUserRestaurants() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.session.user);
  const userRestaurants = useSelector((state) => {
    const restaurants = Object.values(state.restaurants);
    return restaurants.filter((restaurant) => restaurant.owner_id === user.id);
  });

  useEffect(() => {
    closeMenu();
    dispatch(restaurantActions.getUserRestaurants(user)).then(() => setIsLoaded(true));
  }, [dispatch, user]);

  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <div id="spots-flex">
        {isLoaded &&
          userRestaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <div className="allspots">
                <NavLink to={`/restaurants/${restaurant.id}`}>
                  <img
                    src={restaurant.logo}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = 'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
                    }}
                    alt="Restaurant Logo"
                  />
                  <div className="city">
                    <p className="location">{`${restaurant.city}, ${restaurant.state}`}</p>
                    <p className="ratingsbox">
                      <i className="fa fa-star" aria-hidden="true"></i>
                      {!restaurant.rating ? "No Stars" : Math.round(restaurant.rating / 0.10) * 0.10}
                    </p>
                  </div>
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
                      modalComponent={<DeleteRestaurant prop={restaurant} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default CurrentUserRestaurants;
