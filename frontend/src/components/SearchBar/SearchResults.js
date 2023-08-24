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
    const selectedDateTime = new Date(selectedDate);
    const [selectedHour, selectedMinute] = selectedTime.split(":").map(Number);
    selectedDateTime.setHours(selectedHour, selectedMinute, 0, 0);
    const selectedDayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDateTime.getDay()];
  
    // Filter restaurants by name match
    const nameMatchResults = Object.values(searchbar).filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  
    // Sort by name similarity
    nameMatchResults.sort((a, b) =>
      a.name.toLowerCase().indexOf(searchInput.toLowerCase()) -
      b.name.toLowerCase().indexOf(searchInput.toLowerCase())
    );
  
    // Filter and sort remaining restaurants based on availability and other criteria
    const otherResults = Object.values(searchbar)
      .filter(restaurant => !nameMatchResults.includes(restaurant))
      .filter((restaurant) => {
        const openingHours = restaurant.Openinghours.find(
          (hours) => hours.day === selectedDayOfWeek
        );
  
        if (!openingHours) {
          return false; // Restaurant is closed on the selected day
        }
  
        const openTimeParts = openingHours.open.split(":");
        const closeTimeParts = openingHours.close.split(":");
        const openHours = parseInt(openTimeParts[0]);
        const openMinutes = parseInt(openTimeParts[1]);
        const closeHours = parseInt(closeTimeParts[0]);
        const closeMinutes = parseInt(closeTimeParts[1]);
  
        const openTime = new Date();
        openTime.setHours(openHours, openMinutes, 0, 0);
        const closeTime = new Date();
        closeTime.setHours(closeHours, closeMinutes, 0, 0);
  
        const isRestaurantOpen =
          openTime <= selectedDateTime && closeTime >= selectedDateTime;
  
        return (
          restaurant.seats >= selectedSeats && // Check seats availability
          isRestaurantOpen
        );
      })
      .sort((a, b) =>
        a.seats - b.seats || // Sort by available seats
        Math.abs(a.open - selectedHour) - Math.abs(b.open - selectedHour) || // Sort by closest opening time
        Math.abs(a.close - selectedHour) - Math.abs(b.close - selectedHour) // Sort by closest closing time
      );
  
    const finalResults = [...nameMatchResults, ...otherResults];
  
    setResults(finalResults); // Update the search results
  }, [searchbar, searchInput, selectedSeats, selectedTime, selectedDate]);
  
  

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
      {console.log("Results:", results)} {/* Add this line */}
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
