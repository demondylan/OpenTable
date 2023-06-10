import * as restaurantActions from "../../store/restaurants";
import * as searchbarActions from "../../store/searchbar";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import './Restaurants.css';

function Home() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  let restaurants = useSelector((state) => state.restaurants)
  restaurants = Object.values(restaurants)

  useEffect(() => {
    dispatch(restaurantActions.getALLRestaurants()).then(dispatch(searchbarActions.getALLRestaurants())).then(() => setIsLoaded(true))
  }, [dispatch])

  function getStatus(restaurant) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const openingHour = parseInt(restaurant.open.split(':')[0]);
    const closingHour = parseInt(restaurant.close.split(':')[0]);
    
    console.log(currentHour, openingHour, closingHour);

    if (currentHour >= openingHour && currentHour < closingHour) {
      return "Open";
    } else {
      return "Closed";
    }
  }

  function getTime(time) {
    time = time.split(':'); // convert to array
    // fetch
    let hours = Number(time[0]);
    let minutes = Number(time[1]);

    // calculate
    let timeValue;
    
    if (hours > 0 && hours <= 12) {
      timeValue= "" + hours;
    } else if (hours > 12) {
      timeValue= "" + (hours - 12);
    } else if (hours == 0) {
      timeValue= "12";
    }
     
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM
    return timeValue
    }

  return (
 <> 

    <div id="spots-flex">
      {isLoaded &&
       restaurants.map((restaurant) => (<div key={restaurant.id}>
          <div className="allspots">
          <NavLink to={`/restaurants/${restaurant.id}`}>
            <img src={restaurant.logo} onError={({ currentTarget }) => {
    currentTarget.onerror = null; // prevents looping
    currentTarget.src='https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
  }}/>
           <div className="city"> <p className="location">{restaurant.name}, {restaurant.city}</p><p className="ratingsbox"><i className="fa fa-star" aria-hidden="true"></i>{!restaurant.rating ? "No" : Math.round(`${restaurant.rating}` / .10) * .10} STARS</p></div>
           <div className="price"> <p>{getStatus(restaurant)} <span>{getTime(restaurant.open)}</span>  -  <span>{getTime(restaurant.close)}</span> </p></div>
          </NavLink>
          </div>
        </div>))}
        </div>
   </>
  )
}

export default Home;