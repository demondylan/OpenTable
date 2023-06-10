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

  const songsObj = useSelector(state => state.searchbar)
  const songsArr = Object.values(songsObj);

 

  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    const results = songsArr.filter(song => {
      if (e.target.value === "") return song
      if(song.name.toLowerCase().includes(e.target.value.toLowerCase()) || song.city.toLowerCase().includes(e.target.value.toLowerCase()) || song.zip_code.includes(e.target.value))
      return true
    })
    setState({
      query: e.target.value,
      list: results
    })
  }

  const handleAddClick = async (song) => {
    await dispatch(getRestaurant())
   
    localStorage.setItem('recentSearch', song.name);

    setState({
      query: "",
      list: []
    })
    setSearchInput("")
    history.push(`/restaurants/${song.id}`)
  };


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
      { (
        <div>

          <div className="search-container">
            <div className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              type="text"
              placeholder={"What restauraunt are you looking for?"}
              className="search-input"
              value={searchInput}
              onChange={handleChange}
            />
               <GetLocation/>
          </div>

          <ul className="search-song-result" >
            {(state.query === '' ? "" : state.list.slice(0, 13).map(song => (
              (
                
                <div className="allspots">
                <NavLink to={`/restaurants/${song.id}`}>
                  <img src={song.logo} onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src='https://www.oklahomajoes.com/media/catalog/product/placeholder/default/image-not-available-black.png';
        }}/>
                 <div className="city"> <p className="location">{song.city}, {song.state}</p><p className="ratingsbox"><i className="fa fa-star" aria-hidden="true"></i>{!song.rating ? "No" : Math.round(`${song.rating}` / .10) * .10} STARS</p></div>
                 <div className="price"> <p>{getStatus(song)} <span>{getTime(song.open)}</span>  -  <span>{getTime(song.close)}</span> </p></div>
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
