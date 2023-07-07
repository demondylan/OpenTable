import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getALLRestaurants } from "../../store/restaurants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useHistory, useParams } from "react-router-dom";
import './SearchBar.css';
import { getRestaurant } from "../../store/restaurants";
import GetLocation from '../Restaurants/GetLocation';

export default function SearchBar() {
  const currentUrl = window.location.href;
  const history = useHistory();
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants);
  const [searchInput, setSearchInput] = useState("");
  const [recentSearch, setRecentSearch] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [errors, setErrors] = useState([]);
  const [state, setState] = useState({
    query: '',
    list: []
  });

  useEffect(() => {
    dispatch(getALLRestaurants());
  }, [dispatch]);
  const searchBarObj = useSelector(state => state.searchbar);
  const searchesArr = Object.values(searchBarObj);

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    const results = searchesArr.filter(search => {
      if (e.target.value === "") return search;
      if (search.name.toLowerCase().includes(e.target.value.toLowerCase()) || search.food_type.toLowerCase().includes(e.target.value.toLowerCase()) || search.city.toLowerCase().includes(e.target.value.toLowerCase()) || search.zip_code.includes(e.target.value)) {
        return true;
      }
    });
    setState({
      query: e.target.value,
      list: results
    });
  };

  const handleSearchResults = () => {
    // Perform any necessary validation or error checking here
  
    // Redirect to the search results page with the search parameters
    history.push(`/search-results?search=${searchInput}&date=${selectedDate}&time=${selectedTime}&seats=${selectedSeats}`);
  };

  const [showComponent, setShowComponent] = useState(window.innerWidth > 1299);

  useEffect(() => {
    const storedRecentSearch = localStorage.getItem('recentSearch');
    if (storedRecentSearch) {
      setRecentSearch(storedRecentSearch);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowComponent(window.innerWidth > 1299);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function getStatus(restaurant) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const openingHour = parseInt(restaurant.open.split(':')[0]);
    const closingHour = parseInt(restaurant.close.split(':')[0]);

    if (currentHour >= openingHour && currentHour < closingHour) {
      return "Open";
    } else {
      return "Closed";
    }
  }

  // Get the nearest future hour
  const currentHour = new Date().getHours();
  const nearestFutureHour = currentHour < 23 ? currentHour + 1 : 0;

  function getTime(time) {
    time = time.split(':');
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

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeValue += (hours >= 12) ? " PM" : " AM";
    return timeValue;
  }

  // Get today's date
  const today = new Date().toISOString().split('T')[0];




// Set the default values for date and time
const [selectedDate, setSelectedDate] = useState(today);
const [selectedTime, setSelectedTime] = useState(`${nearestFutureHour.toString().padStart(2, '0')}:00`);


  return (
    <>
      {(
        <div className="search-header">
          <div className="searchplan">
            <h1 className="search-text">Find your table for any occasion</h1>
            <div className="search-container">
  <div className="search-input-container">
    <input
      type="date"
      className="search-input"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
    <input
      type="time"
      className="search-input"
      value={selectedTime}
      onChange={(e) => setSelectedTime(e.target.value)}
    />
  <select
  className="search-input"
  value={selectedSeats}
  onChange={(e) => setSelectedSeats(e.target.value)}
>
  {[...Array(20)].map((_, index) => (
    <option key={index} value={index + 1}>
      {index + 1}
    </option>
  ))}
</select>
  </div>
  <div className="search-input-container">
    <FontAwesomeIcon icon={faSearch} className="search-icon" />
    <input
      type="text"
      placeholder="Location, Restaurant, or Cuisine"
      className="search-input"
      value={searchInput}
      onChange={handleChange}
    />
  </div>
  <button className="search-button" onClick={handleSearchResults}>
              Let's Go
            </button>
</div>

            <ul className="search-song-result">
              {(state.query === '' ? "" : state.list.slice(0, 13).map(search => (
                <div className="allspots" key={search.id}>
                  <NavLink to={`/restaurants/${search.id}`}>
                    <img src={search.logo} onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = 'https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
                    }} />
                    <div className="city">
                      <p className="location">{search.city}, {search.state}</p>
                      <p className="ratingsbox">
                        <i className="fa fa-star" aria-hidden="true"></i>
                        {!search.rating ? "No" : Math.round(`${search.rating}` / .10) * .10} STARS
                      </p>
                    </div>
                    <div className="price">
                      <p>{getStatus(search)} <span>{getTime(search.open)}</span> - <span>{getTime(search.close)}</span></p>
                    </div>
                  </NavLink>
                </div>
              )))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
