import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getALLRestaurants } from "../../store/restaurants";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract the search parameters from the URL
  const searchInput = searchParams.get("search");
  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");
  const selectedSeats = searchParams.get("seats");

  const dispatch = useDispatch();
  const searchbar = useSelector((state) => state.restaurants);

  // State to store the search results
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Update the search results based on the search parameters and available restaurants
    const filteredResults = Object.values(searchbar).filter((restaurant) => {
      // Convert open and close times to Date objects
      const openTimeParts = restaurant.open.split(":");
      const closeTimeParts = restaurant.close.split(":");
      
      // Parse hours and minutes from the time parts
      const openHours = parseInt(openTimeParts[0]);
      const openMinutes = parseInt(openTimeParts[1]);
      const closeHours = parseInt(closeTimeParts[0]);
      const closeMinutes = parseInt(closeTimeParts[1]);
      
      // Create Date objects with the current date and parsed time
      const openTime = new Date();
      openTime.setHours(openHours, openMinutes, 0, 0);
      
      const closeTime = new Date();
      closeTime.setHours(closeHours, closeMinutes, 0, 0);
      
      // Log the converted values
      console.log("Open Time:", openTime);
      console.log("Close Time:", closeTime);
  
      // Rest of the filtering logic...
  
      return (
        restaurant.seats > 0 &&
        openTime <= new Date(selectedTime) &&
        closeTime >= new Date(selectedTime)
      );
    });

    setResults(filteredResults); // Update the search results
  }, [searchbar, selectedTime, selectedSeats]);

  // Dispatch the getALLRestaurants action when the component mounts
  useEffect(() => {
    dispatch(getALLRestaurants());
  }, [dispatch]);

  return (
    <div>
      <h2>Search Results</h2>
      <p>
        Search: {searchInput}, Date: {selectedDate}, Time: {selectedTime}, Seats: {selectedSeats}
      </p>
      {results.length > 0 ? (
        <ul>
          {results.map((restaurant) => (
            <li key={restaurant.id}>{restaurant.name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;