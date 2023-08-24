import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createRestaurant } from "../../store/restaurants";
import './Restaurants.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Geocode from "react-geocode";

const CreateRestaurant = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [restaurantData, setRestaurantData] = useState({
    address: "",
    city: "",
    zip_code: "",
    description: "",
    name: "",
    phone: "",
    logo: "",
    food_type: "",
    state: "",
    lat: 0.0,
    lng: 0.0,
    OpeningHours: [
      { day: 'Monday', open: '08:00', close: '20:00' },
      { day: 'Tuesday', open: '08:00', close: '20:00' },
      { day: 'Wednesday', open: '08:00', close: '20:00' },
      { day: 'Thursday', open: '08:00', close: '20:00' },
      { day: 'Friday', open: '08:00', close: '20:00' },
      { day: 'Saturday', open: '08:00', close: '20:00' },
      { day: 'Sunday', open: '08:00', close: '20:00' },
    ],
  });

  const handleOpeningTimeChange = (index, value) => {
    const updatedOpeningHours = [...restaurantData.OpeningHours];
    updatedOpeningHours[index].open = value;
    setRestaurantData((prevData) => ({ ...prevData, OpeningHours: updatedOpeningHours }));
  };

  const handleClosingTimeChange = (index, value) => {
    const updatedOpeningHours = [...restaurantData.OpeningHours];
    updatedOpeningHours[index].close = value;
    setRestaurantData((prevData) => ({ ...prevData, OpeningHours: updatedOpeningHours }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedOpeningHours = restaurantData.OpeningHours.map(({ day, open, close }) => ({
      day,
      open: open ? open : null,
      close: close ? close : null,
    }));

    const GeoAddress = `${restaurantData.address}, ${restaurantData.city}, ${restaurantData.state}`;
    const encodedAddress = encodeURIComponent(GeoAddress);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const { lat, lng } = location;
        setRestaurantData((prevData) => ({ ...prevData, lat, lng }));
        console.log(`Latitude: ${lat}`);
        console.log(`Longitude: ${lng}`);

        const restaurant = {
          ...restaurantData,
          OpeningHours: formattedOpeningHours,
          lat,
          lng,
        };
        const newRestaurant = await dispatch(createRestaurant(restaurant));

        if (newRestaurant) {
          const restaurantId = newRestaurant.id;
          history.push(`/restaurants/${restaurantId}`);
        }
      } else {
        console.log("Unable to geocode the address.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTimePickerClick = (e) => {
    const containerElement = e.currentTarget;
    const inputElement = containerElement.querySelector('input[type="time"]');
    if (inputElement) {
      inputElement.focus(); // Focus on the input element
      inputElement.select(); // Highlight the entire input value
    }
  };

  return (
    <div className="form">
      <section>
        <form onSubmit={handleSubmit}>
          <label>
            Street Address
            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              value={restaurantData.address}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            City
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              value={restaurantData.city}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            State
            <input
              type="text"
              name="state"
              placeholder="State"
              required
              value={restaurantData.state}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Zip Code
            <input
              type="text"
              name="zip_code"
              placeholder="Zip Code"
              required
              value={restaurantData.zip_code}
              onChange={handleChange}
            />
          </label>
          <br />
          {restaurantData.OpeningHours.map((day, index) => (
            <div key={index}>
              <label>
                {day.day} Opens
                <div className="time-picker" onClick={handleTimePickerClick}>
                  <TimePicker
                    required
                    disableClock
                    clearIcon={null}
                    format="HH:mm"
                    value={day.open}
                    onChange={(value) => handleOpeningTimeChange(index, value)}
                  />
                </div>
              </label>
              <br />
              <label>
                {day.day} Closes
                <div className="time-picker" onClick={handleTimePickerClick}>
                  <TimePicker
                    required
                    disableClock
                    clearIcon={null}
                    format="HH:mm"
                    value={day.close}
                    onChange={(value) => handleClosingTimeChange(index, value)}
                  />
                </div>
              </label>
              <br />
            </div>
          ))}
          <br />
          <label>
            Describe your place to guests
            <input
              type="text"
              name="description"
              placeholder="Description"
              required
              value={restaurantData.description}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Restaurant Name
            <input
              type="text"
              name="name"
              placeholder="Name of your Restaurant"
              required
              value={restaurantData.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Phone number
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              required
              value={restaurantData.phone || ''}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Logo
            <br />
            <input
              type="text"
              name="logo"
              placeholder="Logo"
              required
              value={restaurantData.logo}
              onChange={handleChange}
            />
          </label>
          <br />
          <button className='slideshow-button' type="submit">Create Restaurant</button>
        </form>
      </section>
    </div>
  );
};

export default CreateRestaurant;
