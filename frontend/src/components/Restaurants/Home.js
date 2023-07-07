import * as restaurantActions from "../../store/restaurants";
import * as searchbarActions from "../../store/searchbar";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Restaurants.css";

function Home() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const restaurants = useSelector((state) => Object.values(state.restaurants));
  const [userLocation, setUserLocation] = useState(null);
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

    openingTime.setHours(
      parseInt(restaurant.open.split(":")[0]),
      parseInt(restaurant.open.split(":")[1])
    );
    closingTime.setHours(
      parseInt(restaurant.close.split(":")[0]),
      parseInt(restaurant.close.split(":")[1])
    );

    if (currentTime >= openingTime && currentTime < closingTime) {
      return (
        "Open " +
        openingTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        "-" +
        closingTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      return (
        "Closed Opens Tomorrow At " +
        openingTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }

  function getTime(time) {
    const date = new Date();
    const [hours, minutes] = time.split(":");
    date.setHours(hours);
    date.setMinutes(minutes);
  
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    };

    getUserLocation();
  }, []);

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
    if (!userLocation) return restaurants;
    return [...restaurants].sort((a, b) => {
      const distanceA = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.lat,
        a.lng,
        "M"
      );
      const distanceB = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.lat,
        b.lng,
        "M"
      );
  
      return distanceA - distanceB;
    });
  }


  const handleClickNext = () => {
    if (currentSlide < restaurants.length - 5) {
      setCurrentSlide(currentSlide + 5);
    } else {
      setCurrentSlide(restaurants.length - 5);
    }
  };
  
  const handleClickPrev = () => {
    if (currentSlide >= 5) {
      setCurrentSlide(currentSlide - 5);
    } else {
      setCurrentSlide(0);
    }
  };
  
  const displayedRestaurants = restaurants.slice(currentSlide, currentSlide + 5);
  const sortedRestaurants = sortRestaurantsByDistance(displayedRestaurants);

  return (
    <>
      <h1>All Restaurants</h1>
      <div className="slideshow-container">
        <div id="spots-flex" className="restaurant-container">
          <div className="button-container">
            <button
              className="slideshow-button prev-button"
              onClick={handleClickPrev}
              disabled={currentSlide === 0}
            >
              Previous
            </button>
          </div>
          {isLoaded &&
            sortedRestaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="restaurant-card">
                <NavLink to={`/restaurants/${restaurant.id}`}>
                  <img
                    className="restaurantimgcard"
                    src={restaurant.logo}
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src =
                        "https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png";
                    }}
                    alt="Restaurant Logo"
                  />
                  <div className="allspots">
                    <div className="city">
                      <p className="location">
                        {restaurant.name}, {restaurant.city}
                      </p>
                      <p className="ratingsbox">
                        <i className="fa fa-star" aria-hidden="true"></i>
                        {!restaurant.rating
                          ? "No Rating"
                          : `Overall Rating: ${restaurant.rating}`}
                      </p>
                    </div>
                    <div className="price">
                      <p>{getStatus(restaurant)}</p>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          <div className="button-container">
            <button
              className="slideshow-button next-button"
              onClick={handleClickNext}
              disabled={currentSlide >= restaurants.length - 5}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;