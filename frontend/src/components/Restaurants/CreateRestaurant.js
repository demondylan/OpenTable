import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createRestaurant, getRestaurant } from "../../store/restaurants";
import './Restaurants.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Geocode from "react-geocode";

const CreateRestaurant = ({ formType }) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [restaurantData, setRestaurantData] = useState({
    address: "",
    city: "",
    zip_code: "",
    description: "",
    open: "",
    close: "",
    name: "",
    phone: "",
    logo: "",
    food_type: "",
    state: "",
    lat: 0.0,
    lng: 0.0,
    openingHours: [
      { day: 'Monday', open: '', close: '' },
      { day: 'Tuesday', open: '', close: '' },
      { day: 'Wednesday', open: '', close: '' },
      { day: 'Thursday', open: '', close: '' },
      { day: 'Friday', open: '', close: '' },
      { day: 'Saturday', open: '', close: '' },
      { day: 'Sunday', open: '', close: '' },
    ]
  });

  const handleOpeningTimeChange = (index, value) => {
    const updatedOpeningHours = [...restaurantData.openingHours];
    updatedOpeningHours[index].open = value;
    setRestaurantData(prevData => ({ ...prevData, openingHours: updatedOpeningHours }));
  };

  const handleClosingTimeChange = (index, value) => {
    const updatedOpeningHours = [...restaurantData.openingHours];
    updatedOpeningHours[index].close = value;
    setRestaurantData(prevData => ({ ...prevData, openingHours: updatedOpeningHours }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedOpeningHours = restaurantData.openingHours.map(({ day, open, close }) => ({
      day,
      open: open ? new Date(`1970-01-01T${open}:00`) : null,
      close: close ? new Date(`1970-01-01T${close}:00`) : null,
    }));
    
    const GeoAddress = `${restaurantData.address}, ${restaurantData.city}, ${restaurantData.state}`;
    const encodedAddress = encodeURIComponent(GeoAddress);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=YOUR_API_KEY`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const latitudeRes = location.lat;
        const longitudeRes = location.lng;
        setRestaurantData(prevData => ({ ...prevData, lat: latitudeRes, lng: longitudeRes }));
        console.log(`Latitude: ${latitudeRes}`);
        console.log(`Longitude: ${longitudeRes}`);
  
        const restaurant = {
          ...restaurantData,
          openingHours: formattedOpeningHours,
          lat: latitudeRes,
          lng: longitudeRes,
        };
        let newRestaurant = await dispatch(createRestaurant(restaurant));
  
        if (newRestaurant) {
          let restaurantId = newRestaurant.id;
          history.push(`/restaurants/${restaurantId}`);
        }
      } else {
        console.log('Unable to geocode the address.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleTimePickerClick = (e) => {
    const containerElement = e.currentTarget;
    const inputElement = containerElement.querySelector('input[type="time"]');
    if (inputElement) {
      inputElement.click();
    }
  };
  return (
    <div className='form'>
      <section>
        <form onSubmit={handleSubmit} >

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
          {restaurantData.openingHours.map((day, index) => (
  <div key={index}>
    <label>
      {day.day} Opens
      <div className="time-picker" onClick={handleTimePickerClick}>
        <input
          type="time"
          required
          value={day.open}
          onChange={(e) => handleOpeningTimeChange(index, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </label>
    <br />
    <label>
      {day.day} Closes
      <div className="time-picker" onClick={handleTimePickerClick}>
        <input
          type="time"
          required
          value={day.close}
          onChange={(e) => handleClosingTimeChange(index, e.target.value)}
          onClick={(e) => e.stopPropagation()}
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
            <br></br>
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
          <label>
            Food Type
            <input
              type="text"
              name="food_type"
              placeholder="Food Type"
              required
              value={restaurantData.food_type}
              onChange={handleChange}
            />
          </label>
          <br></br>
          <div className='createbutton'>
            <button type="submit">Create new Restaurant</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateRestaurant;
