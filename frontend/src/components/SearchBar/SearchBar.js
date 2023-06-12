import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { NavLink } from "react-router-dom";
import './SearchBar.css'
import { getRestaurant } from "../../store/restaurants";
import { useHistory, useParams } from 'react-router-dom';
import GetLocation from '../Restaurants/GetLocation'

export default function SearchBar() {
  const currentUrl = window.location.href;
  const history = useHistory();
  const dispatch = useDispatch()
  const [searchInput, setSearchInput] = useState("");
  const [recentSearch, setRecentSearch] = useState("")
  const [errors, setErrors] = useState([]);
  const [state, setState] = useState({
    query: '',
    list: []
  })

  const searchBarObj = useSelector(state => state.searchbar)
  const searchesArr = Object.values(searchBarObj);

 

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    const results = searchesArr.filter(search => {
      if (e.target.value === "") return search
      if(search.name.toLowerCase().includes(e.target.value.toLowerCase()) || search.food_type.toLowerCase().includes(e.target.value.toLowerCase()) || search.city.toLowerCase().includes(e.target.value.toLowerCase()) || search.zip_code.includes(e.target.value))
      return true
    })
    setState({
      query: e.target.value,
      list: results
    })
  }


  const [showComponent, setShowComponent] = useState(
    window.innerWidth > 1299
  );

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
    // events: click, keydown, keyup, submit, load, mouseover, mouseout, resize
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
      { (
        <div>

          <div className="search-container">
            <div className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              type="text"
              placeholder={"What restauraunt are you looking for? (Search by name, city, zip code, or food type)"}
              className="search-input"
              value={searchInput}
              onChange={handleChange}
            />
               
          </div>

          <ul className="search-song-result" >
            {(state.query === '' ? "" : state.list.slice(0, 13).map(search => (
              (
                
                <div className="allspots">
                <NavLink to={`/restaurants/${search.id}`}>
                  <img src={search.logo} onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src='https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
        }}/>
                 <div className="city"> <p className="location">{search.city}, {search.state}</p><p className="ratingsbox"><i className="fa fa-star" aria-hidden="true"></i>{!search.rating ? "No" : Math.round(`${search.rating}` / .10) * .10} STARS</p></div>
                 <div className="price"> <p>{getStatus(search)} <span>{getTime(search.open)}</span>  -  <span>{getTime(search.close)}</span> </p></div>
                </NavLink>
                </div>

                )
            )))}
          </ul>



        </div>
      )}
    </>
  )

}
