import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Geocode from "react-geocode";
import * as restaurantActions from "../../store/restaurants";
import * as reviewActions from "../../store/reviews";
import * as searchbarActions from "../../store/searchbar";
import OpenMenu from '../Navigation/OpenMenu';
import PostReview from "../Reviews/PostReview";
import EditReview from "../Reviews/EditReview";
import DeleteReview from "../Reviews/DeleteReview";
import './Restaurants.css';
import { getALLFavorites, addFavorite, removeFavorite } from "../../store/favorites";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from "react-router-dom";

const FindRestaurant = ({ isPageLoaded }) => {
  const [showMenu, setShowMenu] = useState(false);
  const history = useHistory();
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const restaurant = useSelector((state) => state.restaurants[restaurantId]);
  const reviews = useSelector((state) => state.reviews);
  const favorites = useSelector((state) => state.favorites);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(null);
  const [hoveredTime, setHoveredTime] = useState(null);
  const center = {
    lat: restaurant?.lat || 0,
    lng: restaurant?.lng || 0,
  };

  const allReviews = Object.values(reviews);
  const filteredReviews = allReviews.filter(review => review.restaurant_id == restaurantId);

  const [partySize, setPartySize] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Function to handle the "Find a time" button click
  const handleFindTime = () => {
    // Perform checks to find a suitable reservation time
    // ...
    // Set the selectedTime state with the found time
    setSelectedTime("4:30 PM"); // Placeholder for the actual implementation
  };


  useEffect(() => {
    const fetchData = async () => {
      await dispatch(restaurantActions.getRestaurant(restaurantId));
      await dispatch(reviewActions.getAllReviews(restaurantId));
      await dispatch(searchbarActions.getALLRestaurants());
    };
    
  
    fetchData();
  }, [dispatch, restaurantId, isFavorite]); // Include isFavorite as a dependency
  
  useEffect(() => {
    dispatch(getALLFavorites());
  }, []);
  useEffect(() => {
    const isFavorited = favorites.some(
      (favorite) => favorite.restaurant_id === parseInt(restaurantId, 10)
    );
  
    setIsFavorite(isFavorited);
  }, [favorites, restaurantId]);

  const checkUser = filteredReviews.filter(review => sessionUser && review.user_id === sessionUser.id);
 
 
  function displayOpeningHoursByDay(restaurant) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const openingHours = restaurant.Openinghours;

    // If the restaurant does not have any Opening Hours data, consider it closed
    if (!openingHours || openingHours.length === 0) {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }

    // Create an object to store the opening and closing times for each day of the week
    const openingHoursByDay = {};
    daysOfWeek.forEach((day) => {
      const dayOpeningHours = openingHours.find((hours) => hours.day === day);
      if (dayOpeningHours) {
        openingHoursByDay[day] = {
          open: dayOpeningHours.open,
          close: dayOpeningHours.close,
        };
      } else {
        openingHoursByDay[day] = null; // Set to null if there are no opening hours for the day
      }
    });

    // Function to format the opening hours for a single day
    function formatOpeningHours(day) {
      if (openingHoursByDay[day]) {
        const { open, close } = openingHoursByDay[day];

        // Extract the hours and minutes from the military time strings
        const [openHour, openMinute] = open.split(":").map(Number);
        const [closeHour, closeMinute] = close.split(":").map(Number);

        // Convert to 12-hour format and add "AM" or "PM"
        const formattedOpenTime = formatTime(openHour, openMinute);
        const formattedCloseTime = formatTime(closeHour, closeMinute);

        return `${day}: ${formattedOpenTime} - ${formattedCloseTime}`;
      } else {
        return `${day}: Closed`;
      }
    }

    // Format the opening hours for each day of the week
    const formattedOpeningHours = daysOfWeek.map(formatOpeningHours).join('<br />');

    return <p dangerouslySetInnerHTML={{ __html: formattedOpeningHours }} />;
  }

  function getStatus(restaurant) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const openingHours = restaurant.Openinghours;

  // If the restaurant does not have any Opening Hours data, consider it closed
  if (!openingHours || openingHours.length === 0) {
    return <p className="closed-message">Sorry, We Are Closed</p>;
  }

  // Create an object to store the opening and closing times for each day of the week
  const openingHoursByDay = {};
  daysOfWeek.forEach((day) => {
    const dayOpeningHours = openingHours.find((hours) => hours.day === day);
    if (dayOpeningHours) {
      openingHoursByDay[day] = {
        open: dayOpeningHours.open,
        close: dayOpeningHours.close,
      };
    } else {
      openingHoursByDay[day] = null; // Set to null if there are no opening hours for the day
    }
  });

  // Function to format the opening hours for a single day
  function formatOpeningHours(day) {
    if (openingHoursByDay[day]) {
      const { open, close } = openingHoursByDay[day];

      // Extract the hours and minutes from the military time strings
      const [openHour, openMinute] = open.split(":").map(Number);
      const [closeHour, closeMinute] = close.split(":").map(Number);

      // Convert to 12-hour format and add "AM" or "PM"
      const formattedOpenTime = formatTime(openHour, openMinute);
      const formattedCloseTime = formatTime(closeHour, closeMinute);

      return `${day}: ${formattedOpenTime} - ${formattedCloseTime}`;
    } else {
      return `${day}: Closed`;
    }
  }

  // Format the opening hours for each day of the week
  const formattedOpeningHours = daysOfWeek.map(formatOpeningHours).join('<br />');

  return <p dangerouslySetInnerHTML={{ __html: formattedOpeningHours }} />;
}


function formatTime(hour, minute) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
  const formattedMinute = String(minute).padStart(2, '0'); // Ensure minutes are formatted correctly
  return `${formattedHour}:${formattedMinute} ${period}`;
}

  function generateClickableTimes(openingTimeUserTz, closingTimeUserTz) {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
  
    // Round up to the nearest 15-minute interval
    const remainder = currentMinute % 15;
    if (remainder !== 0) {
      currentMinute += 15 - remainder;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
  
    // Set the current time to the adjusted hour and minute
    currentTime.setHours(currentHour, currentMinute, 0, 0);
  
    const clickableTimes = [];
  
    while (clickableTimes.length < 4) {
      // Check if the current time has already passed the closing time for the day
      if (currentTime >= closingTimeUserTz) {
        break;
      }
  
      let period = currentHour >= 12 ? 'PM' : 'AM'; // Calculate the period for this time slot
      const formattedHour = currentHour % 12 || 12; // Convert hour to 12-hour format
      const formattedMinute = String(currentMinute).padStart(2, '0'); // Ensure minutes are formatted correctly
  
      const timeString = `${formattedHour}:${formattedMinute} ${period}`; // Combine hour, minute, and period
  
      clickableTimes.push({ timeString, period }); // Include the period with the time
  
      currentMinute += 15;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
  
      // If the currentHour exceeds 24, wrap it back to 0.
      if (currentHour >= 24) {
        currentHour = 0;
      }
  
      // Update the period when it's a new day
      if (currentHour === 0 && period === 'PM') {
        period = 'AM';
      }
  
      // Update the currentTime with the next hour and minute
      currentTime.setHours(currentHour, currentMinute, 0, 0);
    }
  
    return clickableTimes; // Return clickableTimes with period for each time slot
  }
  function getStatus(restaurant) {
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const openingHours = restaurant.Openinghours;
  
    // If the restaurant does not have any Opening Hours data, consider it closed
    if (!openingHours || openingHours.length === 0) {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }
  
    // Find the opening hours for the current day
    const todayOpeningHours = openingHours.find((hours) => hours.day === daysOfWeek[currentDay]);
  
    // If there are no opening hours for the current day, consider it closed
    if (!todayOpeningHours || !todayOpeningHours.open || !todayOpeningHours.close) {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }
  
    // Extract the open and close times for today's day (in Mountain Time)
    const [openTimeMT, openPeriodMT] = todayOpeningHours.open.split(" ");
    const [openHourMT, openMinuteMT] = openTimeMT.split(":").map(Number);
    const [closeTimeMT, closePeriodMT] = todayOpeningHours.close.split(" ");
    let [closeHourMT, closeMinuteMT] = closeTimeMT.split(":").map(Number);
  
    // Convert to 24-hour format if the time is in 12-hour format (Mountain Time)
    if (openPeriodMT === "PM" && openHourMT !== 12) {
      openHourMT += 12;
    }
  
    if (closePeriodMT === "PM" && closeHourMT !== 12) {
      closeHourMT += 12;
    }
  
    // Create Date objects for opening and closing times in Mountain Time
    const openingTimeMT = new Date();
    openingTimeMT.setUTCHours(openHourMT, openMinuteMT, 0, 0);
  
    const closingTimeMT = new Date();
    closingTimeMT.setUTCHours(closeHourMT, closeMinuteMT, 0, 0);
  
    // Convert the opening and closing times to the user's local timezone
    const openingTimeUserTz = new Date(openingTimeMT.getTime() + (240 * 60 * 1000)); // Add 4 hours (240 minutes)
    const closingTimeUserTz = new Date(closingTimeMT.getTime() + (240 * 60 * 1000)); // Add 4 hours (240 minutes)
  
    const clickableTimes = generateClickableTimes(openingTimeUserTz, closingTimeUserTz);
  
    // Check if the current time is within the opening and closing times (user's local timezone)
    if (currentTime >= openingTimeUserTz && currentTime < closingTimeUserTz) {
      return (
        <>
          {clickableTimes.map(({ timeString, period }) => {
            const timeStringWithoutPeriod = timeString.slice(0, -3);
            const [hour, minute] = timeStringWithoutPeriod.split(":").map(Number);
            const isHovered = timeString === hoveredTime;
            const timeClassName = isHovered ? "hovered-time" : "";
  
            return (
              <div key={timeString}>
                <button
                  className={`time-button ${timeClassName}`}
                  onClick={() => history.push(`/restaurants/${restaurant.id}?time=${timeString}`)}
                  onMouseEnter={() => setHoveredTime(timeString)}
                  onMouseLeave={() => setHoveredTime(null)}
                >
                  {formatTime(hour, minute, period)}
                </button>
              </div>
            );
          })}
        </>
      );
    } else {
      return <p className="closed-message">Sorry, We Are Closed</p>;
    }
  }

  const getMonthName = (num) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[num - 1];
  };

  const onLoad = (marker) => {
    console.log("marker: ", marker);
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleToggleFavorite = async () => {
    if (isButtonDisabled) {
      return;
    }
  
    setIsButtonDisabled(true);
  
    const favorite = favorites.find((fav) => fav.restaurant_id === parseInt(restaurantId, 10));
  
    if (favorite) {
      // Remove restaurant from favorites
      await dispatch(removeFavorite(favorite.id));
    } else {
      // Add restaurant to favorites
      await dispatch(addFavorite(restaurantId));
    }
  
    await dispatch(getALLFavorites());
  
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000); // Set the desired delay in milliseconds
  };
  
  
  

  if (!restaurant) {
    return <div>Loading restaurant data...</div>;
  }

  return (
    <div>
      <div className="backgroundlogo">
        <img
          src={restaurant.logo}
          onError={(event) => {
            event.target.src = 'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
          }}
          alt="Restaurant Logo"
        />
      </div>
      <div className="restarauntname">
        {restaurant.name}
        {sessionUser && (
          <button
  key={isFavorite ? 'remove' : 'add'}
  className="favorite-button"
  onClick={handleToggleFavorite}
>
  <FontAwesomeIcon
    icon={isFavorite ? solidHeart : regularHeart}
    className={`heart-icon ${isFavorite ? 'favorite' : ''}`}
  />
</button>

        )}
      </div>
      <p>{`${restaurant.address}, ${restaurant.city}, ${restaurant.state}, ${restaurant.zip_code}`}</p>
      <div className="map">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={15}
          >
            <Marker onLoad={onLoad} position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="ownerreserves">
        <div className="reservebox">
        <h2>Make a Reservation</h2>
          <div className="party-size">
            {/* Party Size dropdown */}
            <label htmlFor="party-size">Party Size:</label>
            <select
              id="party-size"
              value={partySize}
              onChange={(e) => setPartySize(parseInt(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, index) => index + 1).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="date-time">
            {/* Date selector */}
            <label htmlFor="reservation-date">Date:</label>
            <input
              type="date"
              id="reservation-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {/* Time selector */}
            <label htmlFor="reservation-time">Time:</label>
            <input
              type="time"
              id="reservation-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            {/* "Find a time" button */}
            <button onClick={handleFindTime}>Find a Time</button>
          </div>
          {/* "Booked 25 times today" text */}
          <p>Booked 25 times today</p>
        </div>
        <div className="additional-info">
        <h2>Additional Information</h2>
        <p>
          Cross street: {restaurant.address}
        </p>
        <p>
          Neighborhood: {restaurant.city}
        </p>
        <h3>Hours of Operation</h3>
        <p>
        {displayOpeningHoursByDay(restaurant)}
        </p>
        <h3>Cuisines</h3>
        <p>
        {restaurant.food_type}
        </p>
        <h3>Dining Style</h3>
        <p>
          Casual Elegant
        </p>
        <h3>Dress Code</h3>
        <p>
          Casual Dress
        </p>
        <h3>Parking Details</h3>
        <p>
          Public Lot
        </p>
        <h3>Payment Options</h3>
        <p>
          AMEX, Diners Club, Discover, MasterCard, Visa
        </p>
        <h3>Additional</h3>
        <p>
        {restaurant.description}
        </p>
        <h3>Website</h3>
        <a href="http://www.konagrill.com/" target="_blank" rel="noopener noreferrer">http://www.konagrill.com/</a>
        <h3>Phone number</h3>
        <p>{restaurant.phone}</p>
        <h3>Catering</h3>
        <p>
          Catering available for delivery or pickup through EZ Cater at: <a href="https://www.ezcater.com/catering/kona-grill-troy" target="_blank" rel="noopener noreferrer">https://www.ezcater.com/catering/kona-grill-troy</a>
        </p>
      </div>
      </div>
      

      <div className="reviewNcreate">
        <div className="numberofreviews">
          <i className="fa fa-star" aria-hidden="true"></i> <div>Overall Rating: {!restaurant.rating ? "No Stars" : restaurant.rating}</div>
          <div className="dot"> <i className="fa fa-circle" aria-hidden="true"></i> </div>
          {filteredReviews.length} reviews
        </div>
        {sessionUser && checkUser.length === 0 && sessionUser.id !== restaurant.owner_id && (
          <div className="postreviewbutton">
            <OpenMenu
              itemText="Post Your Review"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<PostReview restaurantId={restaurantId} />}
            />
          </div>
        )}
      </div>
      <div className="reviewbox">
        {filteredReviews.map((review) => (
          <div key={review.id} className="eachreviewbox">
            <div className="nameNdate">
              <div className="reviewname">{review?.User?.firstName}</div>
              <div className="reviewdate">
                {`${getMonthName(review.updatedAt.slice(0, 7).split("-").reverse()[0])} ${review.updatedAt.slice(5, 7)} ${review.updatedAt.slice(0, 4)}`}
              </div>
            </div>
            <div className="ratingsboxreview">
              <div className="bold">Value Rating:</div>
              <div className="redbold">{review.value_rating}</div>
              <div className="bold">Food Rating:</div>
              <div className="redbold">{review.food_rating}</div>
              <div className="bold">Service Rating:</div>
              <div className="redbold">{review.service_rating}</div>
              <div className="bold">Ambience Rating:</div>
              <div className="redbold">{review.ambience_rating}</div>
            </div>
            <p>{review.message}</p>
            <div className="reviewbuttons">
              {sessionUser && sessionUser.id === review.user_id && (
                <div className="edit-review-button">
                  <OpenMenu
                    itemText="Edit Your Review"
                    onItemClick={() => setShowMenu(false)}
                    modalComponent={<EditReview reviewId={review.id} />}
                  />
                </div>
              )}
              {sessionUser && sessionUser.id === review.user_id && (
                <div className="edit-review-button">
                  <OpenMenu
                    itemText="Delete"
                    onItemClick={() => setShowMenu(false)}
                    modalComponent={<DeleteReview reviewId={review.id} />}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindRestaurant;
