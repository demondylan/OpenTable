import * as restaurantActions from "../../store/restaurants";
import * as searchbarActions from "../../store/searchbar";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import './Restaurants.css';

function Home() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const restaurants = useSelector((state) => Object.values(state.restaurants));
  const [userLocation, setUserLocation] = useState(null); // Add state for user location
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(restaurantActions.getALLRestaurants());
      await dispatch(searchbarActions.getALLRestaurants());
      setIsLoaded(true);
    };

    fetchData();
  }, [dispatch]);

  function getStatus(restaurant, status) {
    const currentTime = new Date();
    const openingTime = new Date();
    const closingTime = new Date();

    openingTime.setHours(parseInt(restaurant.open.split(':')[0]), parseInt(restaurant.open.split(':')[1]));
    closingTime.setHours(parseInt(restaurant.close.split(':')[0]), parseInt(restaurant.close.split(':')[1]));

    if (currentTime >= openingTime && currentTime < closingTime) {
      return "Open " + openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + "-" + closingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return "Closed Opens Tomorrow At " + openingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  function getTime(time) {
    time = time.split(':'); // convert to array
    let hours = Number(time[0]);
    let minutes = Number(time[1]);

    let timeValue;
    
    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours === 0) {
      timeValue = "12";
    }
     
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM
    return timeValue;
  }

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    };

    getUserLocation();
  }, []);

  function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
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
    if (!userLocation) return restaurants;

    return [...restaurants].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.latitude,
        a.longitude,
        "M"
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.latitude,
        b.longitude,
        "M"
      );

      return distanceA - distanceB;
    });
  }
  const handleClickNext = () => {
    if (currentSlide < restaurants.length - 4) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleClickPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  return (
    <>
      <h1>All Restaurants</h1>
      <div className="slideshow-buttons">
      <div className="edit-review-button">
        <button
          onClick={handleClickPrev}
          disabled={currentSlide === 0}
          style={{
            opacity: currentSlide === 0 ? 0 : 1,
            pointerEvents: currentSlide === 0 ? "none" : "auto"
          }}
        >
          Previous
        </button>
        </div>
        <div className="edit-review-button">
        <button
          onClick={handleClickNext}
          disabled={currentSlide >= restaurants.length - 4}
          style={{
            opacity: currentSlide >= restaurants.length - 4 ? 0 : 1,
            pointerEvents: currentSlide >= restaurants.length - 4 ? "none" : "auto"
          }}
        >
          Next
        </button>
        </div>
      </div>
      <div id="spots-flex" className="restaurant-container">
        {isLoaded &&
          restaurants.slice(currentSlide, currentSlide + 4).map((restaurant, index) => (
            <div key={restaurant.id} className="restaurant-card">
          <div className="allspots">
            <NavLink to={`/restaurants/${restaurant.id}`}>
              <img
                src={restaurant.logo}
                onError={(event) => {
                  event.target.onerror = null; // Prevents looping
                  event.target.src = 'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
                }}
                alt="Restaurant Logo"
              />
              <div className="city">
                <p className="location">{restaurant.name}, {restaurant.city}</p>
                <p className="ratingsbox">
                  <i className="fa fa-star" aria-hidden="true"></i>
                  {!restaurant.rating ? "No Rating" : `Overall Rating: ${restaurant.rating}`} 
                </p>
              </div>
              <div className="price">
                <p>{getStatus(restaurant)}</p>
              </div>
            </NavLink>
          </div>
        </div>
      ))}
    </div>
    <div className="slideshow-buttons">
      </div>
    </>
  );
}

export default Home;