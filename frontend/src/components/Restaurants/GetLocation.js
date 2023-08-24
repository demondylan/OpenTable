import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import * as restaurantActions from "../../store/restaurants";
import * as searchbarActions from "../../store/searchbar";
import { NavLink, useLocation } from "react-router-dom";
import "./Restaurants.css";

function GetLocation() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocations, setShowLocations] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const locations = useSelector((state) => Object.values(state.restaurants));
  const favoriteLocations = useSelector((state) => {
    const favorites = state.favorites;
    if (favorites) {
      return Object.values(favorites).map((favorite) => favorite.Location);
    } else {
      return [];
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(restaurantActions.getALLRestaurants());
      await dispatch(searchbarActions.getALLRestaurants());
      setIsLoaded(true);
    };

    fetchData();
  }, [dispatch]);

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

  useEffect(() => {
    setShowLocations(false);
  }, [location]);

  function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
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

  function sortLocationsByDistance(locations) {
    if (!userLocation) return locations;
    return [...locations].sort((a, b) => {
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

  const handleClickToggle = () => {
    setShowLocations(!showLocations);
    setCurrentSlide(0);
  };

  const handleClickPrev = () => {
    setCurrentSlide((prevSlide) => prevSlide - 4);
  };

  const handleClickNext = () => {
    setCurrentSlide((prevSlide) => prevSlide + 4);
  };

  const displayedLocations = locations.slice(currentSlide, currentSlide + 4);
  const sortedLocations = sortLocationsByDistance(displayedLocations);

  return (
    <>
      <button onClick={handleClickToggle} className="toggle-button slideshow-button">
        {showLocations ? "Hide Restaurants Near Me" : "Show Restaurants Near Me"}
      </button>
      {showLocations && (
        <>
          <h1>Locations Near Me</h1>
          <div className="get-location-container">
            {isLoaded &&
              sortedLocations.map((location) => (
                <div key={location.id} className="location-card">
                  <NavLink to={`/restaurants/${location.id}`}>
                    <img
                      src={location.logo}
                      onError={(event) => {
                        event.target.onerror = null;
                        event.target.src =
                          "https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png";
                      }}
                      alt="Location Image"
                    />
                    <div className="location-details">
                      <div className="location-name">{location.name}</div>
                      <div className="location-address">{`${location.address}, ${location.city}, ${location.state}, ${location.zip_code}`}</div>
                      <div className="location-distance">
                        {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          location.lat,
                          location.lng,
                          "M"
                        ).toFixed(2)}{" "}
                        miles away
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))}
          </div>
          <div className="slider-navigation">
            <button
              className="slider-button prev-button slideshow-button"
              onClick={handleClickPrev}
              disabled={currentSlide === 0}
            >
              Prev
            </button>
            <button
              className="slider-button next-button slideshow-button"
              onClick={handleClickNext}
              disabled={currentSlide >= locations.length - 4}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default GetLocation;
