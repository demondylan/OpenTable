import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import * as restaurantActions from "../../store/restaurants";
import * as searchbarActions from "../../store/searchbar";
import * as favoriteActions from "../../store/favorites";
import * as reviewActions from "../../store/reviews";
import "./Restaurants.css";
import { useMemo } from "react";
import { useHistory } from "react-router-dom";

function Home() {

  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const restaurants = useSelector((state) => Object.values(state.restaurants));
  const latestReviews = useSelector((state) => Object.values(state.reviews));
  const sessionUser = useSelector((state) => state.session.user);
  const [hoveredTimes, setHoveredTimes] = useState({});
  const [selectedTimes, setSelectedTimes] = useState({});
  const favoriteRestaurants = useSelector((state) => {
    const favorites = state.favorites;
    if (favorites) {
      return Object.values(favorites).map((favorite) => favorite.Restaurant);
    } else {
      return [];
    }
  });
 
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(restaurantActions.getALLRestaurants());
      await dispatch(searchbarActions.getALLRestaurants());
      await dispatch(favoriteActions.getALLFavorites());
      for (const restaurant of restaurants) {
        await dispatch(reviewActions.getAllReviews(restaurant.id));
      }
      const latestReviews = Object.values(reviewActions)
      .flatMap((reviews) => Object.values(reviews))
      .filter((review) => review.reviews.length > 0);
    await dispatch(reviewActions.setLatestReviewsData(latestReviews));
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

  function convertTimezone(timeString) {
    const [timePart, period] = timeString.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    const timezoneOffset = new Date().getTimezoneOffset();
    let totalMinutes = hours * 60 + minutes;
    totalMinutes -= timezoneOffset;
    totalMinutes = (totalMinutes + 1440) % 1440;
    const convertedHours = Math.floor(totalMinutes / 60);
    const convertedMinutes = totalMinutes % 60;

    const result = `${String(convertedHours).padStart(2, '0')}:${String(convertedMinutes).padStart(2, '0')}`;
    return result;
  }
  function formatTime(hour, minute) {
    const formattedHour = hour % 12 || 12;
    const formattedMinute = isNaN(minute) ? '00' : String(minute).padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM'; // Determine AM or PM based on hour
    return `${formattedHour}:${formattedMinute} ${period}`;
  }
  function generateClickableTimes(openingTimeUserTz, closingTimeUserTz) {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
  
    const remainder = currentMinute % 15;
    if (remainder !== 0) {
      currentMinute += 15 - remainder;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
  
    currentTime.setHours(currentHour, currentMinute, 0, 0);
  
    const clickableTimes = [];
  
    while (clickableTimes.length < 4) {
      if (currentTime >= closingTimeUserTz) {
        break;
      }
  
      let period = currentHour >= 12 ? 'PM' : 'AM'; 
      const formattedHour = currentHour % 12 || 12; 
      const formattedMinute = String(currentMinute).padStart(2, '0'); 
  
      const timeString = `${formattedHour}:${formattedMinute} ${period}`; 
  
      clickableTimes.push({ timeString, period });
  
      currentMinute += 15;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
  
      if (currentHour >= 24) {
        currentHour = 0;
      }
  
      if (currentHour === 0 && period === 'PM') {
        period = 'AM';
      }
  
      currentTime.setHours(currentHour, currentMinute, 0, 0);
    }
  
    return clickableTimes; 
  }

  function getStatus(restaurant) {
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const openingHours = restaurant.Openinghours;
  
    if (!openingHours || openingHours.length === 0) {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }
  
    const todayOpeningHours = openingHours.find((hours) => hours.day === daysOfWeek[currentDay]);
  
    if (!todayOpeningHours || !todayOpeningHours.open || !todayOpeningHours.close) {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }
  
    const [openTime, openPeriod] = todayOpeningHours.open.split(" ");
    const [closeTime, closePeriod] = todayOpeningHours.close.split(" ");
  
    const formattedOpeningTime = formatTime(...openTime.split(':').map(Number), openPeriod);
    const formattedClosingTime = formatTime(...closeTime.split(':').map(Number), closePeriod);
  
    const currentTimeFormatted = formatTime(currentTime.getHours(), currentTime.getMinutes(), 'AM');
  
    if (
      currentTimeFormatted >= formattedOpeningTime &&
      currentTimeFormatted <= formattedClosingTime
    ) {
      const clickableTimes = generateClickableTimes(formattedOpeningTime, formattedClosingTime);
  
      return (
        <div className="clickable-times">
          {clickableTimes.map(({ timeString }) => (
            <button
  key={timeString}
  className="clickable-time-button red-button" 
  onMouseEnter={() => handleTimeMouseEnter(restaurant.id, timeString)}
  onMouseLeave={() => handleTimeMouseLeave(restaurant.id)}
>
  {timeString}
</button>
          ))}
        </div>
      );
    } else {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }
  }
function handleTimeMouseEnter(restaurantId, timeString) {
  setHoveredTimes((prevHoveredTimes) => ({
    ...prevHoveredTimes,
    [restaurantId]: timeString,
  }));
}

function handleTimeMouseLeave(restaurantId) {
  setHoveredTimes((prevHoveredTimes) => ({
    ...prevHoveredTimes,
    [restaurantId]: null,
  }));
}
function calculateAverageReview(review) {
  const { ambience_rating, food_rating, service_rating, value_rating } = review;
  const totalRatings = ambience_rating + food_rating + service_rating + value_rating;
  const averageRating = totalRatings / 4; // There are 4 rating categories
  return averageRating.toFixed(1); // You can format the average rating as per your requirement
}

function getTotalReviewsLeft(id) {
  if (!latestReviews || latestReviews.length === 0) {
    return 0; // No reviews for the user, return 0
  }

  // Filter the reviews where the user_id matches the logged-in user's ID
  const reviewsForUser = latestReviews.filter((review) => review.user_id === id);
  

  // Calculate the total number of reviews left
  const totalReviewsLeft = reviewsForUser.length;

  return totalReviewsLeft;
}
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
    setCurrentSlide((prevSlide) => prevSlide + 5);
  };

  const handleClickPrev = () => {
    setCurrentSlide((prevSlide) => prevSlide - 5);
  };

  const displayedRestaurants = restaurants.slice(currentSlide, currentSlide + 5);
  const sortedRestaurants = sortRestaurantsByDistance(displayedRestaurants);

  return (
    <>

      <div className="slideshow-container">
        <h2>Favorite Restaurants</h2>
        <div className="restaurant-container">
          {isLoaded &&
            favoriteRestaurants?.map((restaurant) => (
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
                        </NavLink>
                  <div className="allspots">
                    <div className="city">
                    <NavLink to={`/restaurants/${restaurant.id}`}>
                      <p className="location">
                        {restaurant.name}, {restaurant.city}
                      </p>
                      </NavLink>
                      <p className="ratingsbox">
                        <i className="fa fa-star" aria-hidden="true"></i>
                        {!restaurant.rating
                          ? "No Rating"
                          : `Overall Rating: ${restaurant.rating}`}
                      </p>
                    </div>
                    <div className="price">{getStatus(restaurant, setHoveredTimes)}</div>
                  </div>
              </div>
            ))}
        </div>
        <h2>All Restaurants</h2>
        <div className="restaurant-container">
          {isLoaded &&
            sortedRestaurants.map((restaurant) => (
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
                                  </NavLink>
                  <div className="allspots">
                    <div className="city">
                    <NavLink to={`/restaurants/${restaurant.id}`}>
                      <p className="location">
                        {restaurant.name}, {restaurant.city}
                      </p>
                      </NavLink>
                      <p className="ratingsbox">
                        <i className="fa fa-star" aria-hidden="true"></i>
                        {!restaurant.rating
                          ? "No Rating"
                          : `Overall Rating: ${restaurant.rating}`}
                      </p>
                    </div>
                    <div className="price">
                    {getStatus(restaurant, setHoveredTimes)}
</div>
                  </div>
              </div>
            ))}
            
        </div>
        <div className="button-container">
          <button
            className="slideshow-button prev-button"
            onClick={handleClickPrev}
            disabled={currentSlide === 0}
          >
            Previous
          </button>
          <button
            className="slideshow-button next-button"
            onClick={handleClickNext}
            disabled={currentSlide >= restaurants.length - 5}
          >
            Next
          </button>
        </div>
        <h2>Latest Reviews</h2>
      <div className="latest-reviews-container">
        {isLoaded ? (
          latestReviews?.map((review) => {
            const restaurant = restaurants[review.restaurant_id];
            if (!restaurant) {
              return null;
            }

            return (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3>{review.User.firstName}</h3>
                  <p>Total Reviews Left: {getTotalReviewsLeft(review.User.id)}</p>
                  <p>Average Review: </p>
                </div>
                <div className="review-message">
                  <p>{review.message}</p>
                  <a href="#">More info</a>
                </div>
                <div className="box-name-city">
                  <p>{restaurant.name}, {restaurant.city}</p>
                </div>
                <div className="food-type">
                  <p>Food Type: {restaurant.food_type}</p>
                  <p>Total Average Rating:  {calculateAverageReview(review)}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div>Loading latest reviews...</div>
        )}
      </div>

      </div>
    </>
  );
}

export default Home;