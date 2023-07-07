import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import * as restaurantActions from '../../store/restaurants';
import * as searchbarActions from '../../store/searchbar';
import { NavLink } from 'react-router-dom';
import './Restaurants.css';

const GetLocation = () => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => Object.values(state.restaurants));
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [showRestaurants, setShowRestaurants] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(restaurantActions.getALLRestaurants());
      await dispatch(searchbarActions.getALLRestaurants());
    };

    fetchData();
  }, [dispatch]);

  const handlePosition = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      const { latitude, longitude } = position.coords;
  
      // Store latitude and longitude values in cookies
      Cookies.set("latitude", latitude);
      Cookies.set("longitude", longitude);
  
      const sorted = sortRestaurantsByDistance(restaurants, latitude, longitude);
      setSortedRestaurants(sorted);
      setShowRestaurants(!showRestaurants);
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  };
  


  
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  const getStatus = (restaurant) => {
    const currentTime = new Date();
    const openingTime = new Date();
    const closingTime = new Date();

    openingTime.setHours(
      parseInt(restaurant.open.split(':')[0]),
      parseInt(restaurant.open.split(':')[1])
    );
    closingTime.setHours(
      parseInt(restaurant.close.split(':')[0]),
      parseInt(restaurant.close.split(':')[1])
    );

    if (currentTime >= openingTime && currentTime < closingTime) {
      return (
        'Open ' +
        openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        '-' +
        closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    } else {
      return 'Closed Opens At ' + openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "M") {
      dist = dist * 0.8684;
    }
    return dist;
  }

  function sortRestaurantsByDistance(restaurants) {
    if (!Cookies.get('latitude') || !Cookies.get('longitude')) return restaurants;
    return [...restaurants].sort((a, b) => {
      const distanceA = calculateDistance(
        Cookies.get('latitude'),
        Cookies.get('longitude'),
        a.lat,
        a.lng,
        "M"
      );
      const distanceB = calculateDistance(
        Cookies.get('latitude'),
        Cookies.get('longitude'),
        b.lat,
        b.lng,
        "M"
      );
  
      return distanceA - distanceB;
    });
  }
  
 
  return (
    <div>
      <button onClick={handlePosition} className='getLoc'>
        {showRestaurants ? 'Hide Restaurants' : 'Show Restaurants Near Me'}
      </button>
      {showRestaurants && sortedRestaurants.length > 0 && (
        <>
        <h1> Restaurants Closest To You.... </h1>
        <div id='spots-flex'>
          {sortedRestaurants.map((restaurant) => (
            <div key={restaurant.id} className='allspots'>
              <NavLink to={`/restaurants/${restaurant.id}`}>
                <img
                  src={restaurant.logo || 'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png'}
                  alt='Restaurant Logo'
                  onError={(event) => {
                    event.target.onerror = null; // Prevents looping
                    event.target.src =
                      'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
                  }}
                />
                <div className='city'>
                  <p className='location'>
                    {restaurant.name}, {restaurant.city}
                  </p>
                  <p className='ratingsbox'>
                    <i className='fa fa-star' aria-hidden='true'></i>
                    {!restaurant.rating ? "No Rating" : `Overall Rating: ${restaurant.rating}`} 
                  </p>
                </div>
                <div className='price'>
                  <p>
                    {getStatus(restaurant)} |{' '}
                    {calculateDistance(
                      Cookies.get('latitude'),
                      Cookies.get('longitude'),
                      restaurant.lat,
                      restaurant.lng,
                      'M'
                    ).toFixed(2)}{' '}
                    miles
                  </p>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default GetLocation;